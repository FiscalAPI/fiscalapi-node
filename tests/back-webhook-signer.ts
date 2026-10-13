/**
 * La firma de WebhookSigner de fapi-back, copiada sin depender del back: HMAC-SHA256 sobre `{id}.{timestamp}.{body}` en
 * UTF-8 con los bytes base64 del secreto (sin `whsec_`), una firma `v1,<base64>` por secreto unidas por un espacio, la
 * vigente primero. Un cuerpo en bytes se firma tal cual, sin decodificarlo.
 */
import { createHmac, randomBytes } from 'crypto';

const SECRET_PREFIX = 'whsec_';

/** Un secreto como WebhookSecret.Generate del back: whsec_ + 32 bytes aleatorios en base64. */
export function generateSecret(): string {
  return SECRET_PREFIX + randomBytes(32).toString('base64');
}

export function sign(id: string, timestamp: number | string, body: string | Buffer, ...secrets: string[]): string {
  const content = Buffer.concat([Buffer.from(`${id}.${timestamp}.`, 'utf8'), Buffer.isBuffer(body) ? body : Buffer.from(body, 'utf8')]);
  return secrets
    .map((secret) => 'v1,' + createHmac('sha256', keyBytes(secret)).update(content).digest('base64'))
    .join(' ');
}

export function signedHeaders(id: string, timestamp: number, body: string | Buffer, ...secrets: string[]): Record<string, string> {
  return {
    'webhook-id': id,
    'webhook-timestamp': String(timestamp),
    'webhook-signature': sign(id, timestamp, body, ...secrets),
  };
}

function keyBytes(secret: string): Buffer {
  return Buffer.from(secret.startsWith(SECRET_PREFIX) ? secret.substring(SECRET_PREFIX.length) : secret, 'base64');
}
