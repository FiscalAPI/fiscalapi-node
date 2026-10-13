/**
 * La entrega no se puede tratar como auténtica: falta un header de Standard Webhooks, ninguna firma coincide, el
 * timestamp está fuera de la tolerancia, el cuerpo no es texto UTF-8 válido o el cuerpo firmado no es un evento. El
 * receptor la rechaza (por ejemplo con un 400) y no la procesa.
 */
export class WebhookVerificationError extends Error {
  /** El error original cuando la causa es otra excepción (por ejemplo el `SyntaxError` de un JSON inválido). */
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'WebhookVerificationError';
    // `cause` como propiedad propia: la opción `{ cause }` de Error no existe en todas las versiones de Node que soporta el SDK.
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}
