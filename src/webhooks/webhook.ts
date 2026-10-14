import { createHmac, timingSafeEqual } from 'crypto';
import { WebhookEvent } from '../models/webhook-event';
import { WebhookVerificationError } from './webhook-verification-error';

/** Un `Headers` de fetch (o cualquier objeto con `get` que no distinga mayúsculas). */
export interface WebhookHeadersGetter {
  get(name: string): string | null;
}

/**
 * Los headers de la petición recibida: el objeto `req.headers` de Node/Express (valores `string` o `string[]`; de un
 * arreglo se usa el primer valor) o un `Headers` de fetch. Los nombres se comparan sin distinguir mayúsculas.
 */
export type WebhookHeaders = WebhookHeadersGetter | Readonly<Record<string, string | readonly string[] | undefined>>;

const ID_HEADER = 'webhook-id';
const TIMESTAMP_HEADER = 'webhook-timestamp';
const SIGNATURE_HEADER = 'webhook-signature';
const SIGNATURE_VERSION = 'v1';
const SIGNATURE_SEPARATOR = ' ';
const VERSION_SEPARATOR = ',';
const SECRET_PREFIX = 'whsec_';

// Base64 estricto, como Convert.FromBase64String: Buffer.from(texto, 'base64') ignora en silencio lo que no es base64.
const STRICT_BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

// Solo dígitos: un signo, espacios o decimales no son segundos Unix.
const UNIX_SECONDS = /^[0-9]+$/;

// El mayor entero de 64 bits con signo: un timestamp mayor no es un número de segundos Unix.
const MAX_INT64 = '9223372036854775807';

// Un sustituto alto sin bajo detrás, o uno bajo sin alto delante: no tiene representación UTF-8. Buffer y TextEncoder lo
// cambian en silencio por U+FFFD, así que se busca explícitamente (String.prototype.isWellFormed exige Node 20).
const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/;

// ISO 8601 con la hora: fecha, hora, fracción opcional y zona opcional (Z o ±hh:mm). Sin zona se lee en UTC, como el
// back la escribe, y no en la zona del proceso.
const ISO_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(?:Z|([+-])(\d{2}):(\d{2}))?$/;

const NOT_AN_EVENT = 'El cuerpo firmado no es un evento de webhook en JSON.';
const NOT_AN_EVENT_PREFIX = 'El cuerpo firmado no es un evento de webhook';

/**
 * Verificación de las entregas de webhooks de FiscalAPI, que se firman con Standard Webhooks
 * (https://www.standardwebhooks.com): HMAC-SHA256 sobre `webhook-id.webhook-timestamp.cuerpo` con el secreto `whsec_…`
 * del endpoint, en el header `webhook-signature` como `v1,<base64>`. La firma es la única prueba de que una entrega viene
 * de FiscalAPI.
 */
export class Webhook {
  /**
   * Diferencia máxima, en segundos, entre `webhook-timestamp` y el reloj del receptor, hacia atrás o hacia adelante: una
   * entrega capturada no se puede repetir después. 5 minutos.
   */
  static readonly DEFAULT_TOLERANCE_SECONDS = 5 * 60;

  private constructor() {}

  /**
   * Verifica una entrega y devuelve su evento. Con varios secretos basta que una firma `v1` del header coincida con uno
   * de ellos: sirve durante una rotación, mientras el receptor despliega el secreto nuevo y conserva el anterior
   * (FiscalAPI firma con ambos durante 24 h).
   *
   * Responda 2xx rápido y procese el evento después, fuera de la petición: FiscalAPI corta cada intento a los 15 s y lo
   * reintenta.
   *
   * @param headers Los headers de la petición recibida: `req.headers` de Node/Express o un `Headers` de fetch.
   * @param body El cuerpo **crudo** tal como llegó (en Express, el `Buffer` de `express.raw({ type: 'application/json' })`),
   *   o ese mismo cuerpo como texto. Nunca uno deserializado y vuelto a serializar (`JSON.stringify(req.body)`): cambian
   *   sus bytes (espacios, orden, escapes) y la firma deja de coincidir.
   * @param secret El secreto del endpoint (`whsec_…`; se acepta también sin el prefijo), o varios.
   * @param toleranceSeconds Tolerancia del timestamp en segundos; por omisión `Webhook.DEFAULT_TOLERANCE_SECONDS`.
   * @returns El evento del cuerpo verificado.
   * @throws {WebhookVerificationError} Falta un header, el timestamp está fuera de la tolerancia, ninguna firma `v1`
   *   coincide, el cuerpo no es texto UTF-8 válido o el cuerpo firmado no es un evento: rechace la entrega sin procesarla.
   * @throws {TypeError} Un argumento falta o no es del tipo esperado, no hay secretos o uno no es base64: es un error de
   *   configuración del receptor, no de la entrega. En una lista indica la posición del secreto, nunca su valor.
   * @throws {RangeError} La tolerancia es negativa o infinita.
   */
  static verify(headers: WebhookHeaders, body: string | Uint8Array, secret: string, toleranceSeconds?: number): WebhookEvent;
  static verify(headers: WebhookHeaders, body: string | Uint8Array, secrets: readonly string[], toleranceSeconds?: number): WebhookEvent;
  static verify(
    headers: WebhookHeaders,
    body: string | Uint8Array,
    secretOrSecrets: string | readonly string[],
    toleranceSeconds: number = Webhook.DEFAULT_TOLERANCE_SECONDS,
  ): WebhookEvent {
    const keys = decodeSecrets(secretOrSecrets);
    if (headers === null || typeof headers !== 'object') {
      throw new TypeError('Los headers de la petición son obligatorios.');
    }
    if (typeof body !== 'string' && !(body instanceof Uint8Array)) {
      throw new TypeError('El cuerpo debe ser el texto o los bytes crudos de la petición.');
    }
    ensureValidTolerance(toleranceSeconds);

    const id = requiredHeader(headers, ID_HEADER);
    const timestamp = requiredHeader(headers, TIMESTAMP_HEADER);
    const signatures = requiredHeader(headers, SIGNATURE_HEADER);

    ensureWithinTolerance(timestamp, toleranceSeconds);
    const text = bodyText(body);
    ensureSigned(keys, signedContent(id, timestamp, text), signatures);
    return readEvent(text);
  }
}

function decodeSecrets(secretOrSecrets: string | readonly string[]): Buffer[] {
  if (typeof secretOrSecrets === 'string') {
    return [decodeSecret(secretOrSecrets, 'El secreto de firma')];
  }
  if (!Array.isArray(secretOrSecrets)) {
    throw new TypeError('El secreto de firma (whsec_…) o la lista de secretos es obligatorio.');
  }
  if (secretOrSecrets.length === 0) {
    throw new TypeError('Se necesita al menos un secreto de firma (whsec_…).');
  }
  return secretOrSecrets.map((secret: unknown, index: number) =>
    decodeSecret(secret, `El secreto de firma en la posición ${index} de secrets`),
  );
}

// Los mensajes nombran el secreto por su posición y nunca incluyen su valor: terminarían en los logs del receptor.
function decodeSecret(secret: unknown, description: string): Buffer {
  if (typeof secret !== 'string') {
    throw new TypeError(`${description} no es texto.`);
  }
  const encoded = secret.startsWith(SECRET_PREFIX) ? secret.substring(SECRET_PREFIX.length) : secret;
  if (!STRICT_BASE64.test(encoded)) {
    throw new TypeError(`${description} no es whsec_ seguido de base64: cópielo completo del webhook.`);
  }
  const key = Buffer.from(encoded, 'base64');
  if (key.length === 0) {
    throw new TypeError(`${description} está vacío.`);
  }
  return key;
}

function ensureValidTolerance(toleranceSeconds: number): void {
  if (typeof toleranceSeconds !== 'number' || Number.isNaN(toleranceSeconds)) {
    throw new TypeError('La tolerancia debe ser un número de segundos.');
  }
  if (toleranceSeconds < 0 || !Number.isFinite(toleranceSeconds)) {
    throw new RangeError('La tolerancia no puede ser negativa ni infinita.');
  }
}

// El texto del cuerpo; uno en bytes debe ser UTF-8 válido: decodificarlo con reemplazos verificaría otro texto.
function bodyText(body: string | Uint8Array): string {
  if (typeof body === 'string') {
    return body;
  }
  const bytes = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  const text = bytes.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(bytes)) {
    throw new WebhookVerificationError('El cuerpo o un header no es texto UTF-8 válido.');
  }
  return text;
}

function requiredHeader(headers: WebhookHeaders, name: string): string {
  const value = isHeadersGetter(headers) ? headers.get(name) : recordHeader(headers, name);
  if (!value) {
    throw new WebhookVerificationError(`Falta el header ${name}.`);
  }
  return value;
}

function isHeadersGetter(headers: WebhookHeaders): headers is WebhookHeadersGetter {
  return typeof (headers as Partial<WebhookHeadersGetter>).get === 'function';
}

function recordHeader(headers: Readonly<Record<string, string | readonly string[] | undefined>>, name: string): string | undefined {
  const key = Object.keys(headers).find((candidate) => candidate.toLowerCase() === name);
  const value = key === undefined ? undefined : headers[key];
  return typeof value === 'string' ? value : value?.[0];
}

function ensureWithinTolerance(timestamp: string, toleranceSeconds: number): void {
  if (!isInt64UnixSeconds(timestamp)) {
    throw new WebhookVerificationError(`El header ${TIMESTAMP_HEADER} no es un número de segundos Unix.`);
  }
  // En segundos enteros. Un timestamp enorme pierde precisión como número, pero sigue lejísimos del reloj y se rechaza
  // por la tolerancia, sin desbordarse.
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - Number(timestamp)) > toleranceSeconds) {
    throw new WebhookVerificationError(
      `El header ${TIMESTAMP_HEADER} difiere más de ${toleranceSeconds} s del reloj del receptor: ` +
        'puede ser una entrega repetida o un reloj desajustado.',
    );
  }
}

function isInt64UnixSeconds(timestamp: string): boolean {
  if (!UNIX_SECONDS.test(timestamp)) {
    return false;
  }
  const digits = timestamp.replace(/^0+(?=\d)/, '');
  return digits.length < MAX_INT64.length || (digits.length === MAX_INT64.length && digits <= MAX_INT64);
}

// El contenido firmado en UTF-8 estricto, con el timestamp tal como llegó.
function signedContent(id: string, timestamp: string, body: string): Buffer {
  const content = `${id}.${timestamp}.${body}`;
  if (LONE_SURROGATE.test(content)) {
    throw new WebhookVerificationError('El cuerpo o un header no es texto UTF-8 válido.');
  }
  return Buffer.from(content, 'utf8');
}

function ensureSigned(keys: readonly Buffer[], content: Buffer, signatureHeader: string): void {
  const expected = keys.map((key) => Buffer.from(createHmac('sha256', key).update(content).digest('base64'), 'utf8'));
  const verified = signatureHeader
    .split(SIGNATURE_SEPARATOR)
    .map(v1Signature)
    .some((signature) => signature !== null && expected.some((candidate) => constantTimeEquals(candidate, signature)));
  if (!verified) {
    throw new WebhookVerificationError(
      `Ninguna firma ${SIGNATURE_VERSION} del header ${SIGNATURE_HEADER} coincide con el cuerpo y el secreto.`,
    );
  }
}

// La firma de una entrada "v1,<base64>"; null si es de otra versión o no tiene versión.
function v1Signature(entry: string): Buffer | null {
  const separator = entry.indexOf(VERSION_SEPARATOR);
  if (separator < 0 || entry.substring(0, separator) !== SIGNATURE_VERSION) {
    return null;
  }
  return Buffer.from(entry.substring(separator + 1), 'utf8');
}

// timingSafeEqual exige el mismo largo; el largo de una firma v1 es público (44), así que comparar el largo antes no
// filtra nada.
function constantTimeEquals(expected: Buffer, actual: Buffer): boolean {
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// JSON.parse no tiene configuración global y rechaza el contenido sobrante; aquí se exige además un objeto.
function readEvent(body: string): WebhookEvent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch (error) {
    throw new WebhookVerificationError(NOT_AN_EVENT, error);
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new WebhookVerificationError(NOT_AN_EVENT);
  }

  const envelope = parsed as Record<string, unknown>;
  ensureEnvelopeShape(envelope);
  if (isPresent(envelope.createdAt)) {
    envelope.createdAt = createdAtDate(envelope.createdAt as string);
  }
  return envelope as unknown as WebhookEvent;
}

// Validación mínima de la forma: los campos que el SDK lee tienen el tipo del contrato si vienen; ausentes o null se
// aceptan, igual que los campos desconocidos.
function ensureEnvelopeShape(envelope: Record<string, unknown>): void {
  ensureTextIfPresent(envelope, 'id');
  ensureTextIfPresent(envelope, 'type');
  ensureTextIfPresent(envelope, 'createdAt');
  ensureObjectIfPresent(envelope, 'data');
  if (isPresent(envelope.data)) {
    ensureObjectIfPresent(envelope.data as Record<string, unknown>, 'relatedObject');
  }
}

function ensureTextIfPresent(owner: Record<string, unknown>, field: string): void {
  if (isPresent(owner[field]) && typeof owner[field] !== 'string') {
    throw invalidField(`el campo ${field} no es texto`);
  }
}

function ensureObjectIfPresent(owner: Record<string, unknown>, field: string): void {
  const value = owner[field];
  if (isPresent(value) && (typeof value !== 'object' || Array.isArray(value))) {
    throw invalidField(`el campo ${field} no es un objeto`);
  }
}

function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null;
}

function invalidField(problem: string): WebhookVerificationError {
  return new WebhookVerificationError(`${NOT_AN_EVENT_PREFIX}: ${problem}.`);
}

// new Date() rueda una fecha imposible (30 de febrero → 2 de marzo, 24:00 → día siguiente): la fecha y la hora
// reconstruidas deben ser las mismas que llegaron.
function createdAtDate(value: string): Date {
  const parts = ISO_DATE_TIME.exec(value);
  if (parts === null) {
    throw invalidField('el campo createdAt no es una fecha ISO 8601');
  }
  const [year, month, day, hour, minute, second] = parts.slice(1, 7).map(Number);
  const wallClock = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const sameWallClock =
    wallClock.getUTCFullYear() === year &&
    wallClock.getUTCMonth() === month - 1 &&
    wallClock.getUTCDate() === day &&
    wallClock.getUTCHours() === hour &&
    wallClock.getUTCMinutes() === minute &&
    wallClock.getUTCSeconds() === second;
  const offsetMinutes = utcOffsetMinutes(parts[8], parts[9], parts[10]);
  if (!sameWallClock || offsetMinutes === null) {
    throw invalidField('el campo createdAt no es una fecha ISO 8601 posible');
  }
  const fractionMs = parts[7] ? Math.floor(Number(parts[7]) * 1000) : 0;
  return new Date(wallClock.getTime() + fractionMs - offsetMinutes * 60000);
}

// Minutos de la zona ±hh:mm (0 sin zona o con Z); null si la zona no existe.
function utcOffsetMinutes(sign: string | undefined, hours: string | undefined, minutes: string | undefined): number | null {
  if (sign === undefined) {
    return 0;
  }
  const h = Number(hours);
  const m = Number(minutes);
  if (h > 23 || m > 59) {
    return null;
  }
  return (sign === '-' ? -1 : 1) * (h * 60 + m);
}
