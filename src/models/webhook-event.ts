/**
 * Un evento de webhook de FiscalAPI: el mismo sobre para todo tipo de evento. Lo devuelve `Webhook.verify` después de
 * validar la firma. Es una notificación ligera: para el estado autoritativo del recurso (el orden de llegada no está
 * garantizado), consulte `data.relatedObject` con el servicio de su tipo (por ejemplo `client.invoices.getById(id)`).
 */
export interface WebhookEvent {
  /**
   * Id del evento; es también el header `webhook-id` y no cambia entre reintentos: úselo para descartar entregas
   * repetidas.
   */
  id: string;

  /**
   * Tipo de evento (ver `WebhookEventTypes`). Es texto y no un enum: un tipo que esta versión del SDK no conoce llega
   * tal cual, sin error, y se ignora.
   */
  type: string;

  /** Momento del cambio de estado, al segundo. El sobre lo trae en UTC (`2026-10-12T18:47:53Z`). */
  createdAt: Date;

  /** Persona del tenant dueña del recurso; null si el recurso no tiene una (factura emitida por valores). */
  personId: string | null;

  /** El recurso que cambió y sus estados. */
  data: WebhookEventData;
}

/** Datos de un `WebhookEvent`. */
export interface WebhookEventData {
  /** El recurso que cambió de estado. */
  relatedObject: WebhookRelatedObject;

  /**
   * Estado al que llegó el recurso, con los códigos públicos de la API v4 (factura `V`, `C`, `X`; solicitud de descarga
   * `1`, `2`, `3`, `-1`; regla de descarga `1`..`4`, `-1`); null si el tipo de evento no lo lleva.
   */
  status: string | null;

  /** Estado del que salió el recurso, con los mismos códigos que `status`; null si no aplica. */
  previousStatus: string | null;
}

/** El recurso al que se refiere un `WebhookEvent`. */
export interface WebhookRelatedObject {
  /** Id del recurso: el que reciben los `getById` de los servicios del SDK. */
  id: string;

  /**
   * Tipo de recurso: `invoice`, `download_request`, `download_rule` o `webhook_endpoint` (el de
   * `WebhookEventTypes.WebhookEndpointTest`); el conjunto puede crecer.
   */
  type: string;

  /**
   * Ruta relativa del GET v4 del recurso (por ejemplo `/api/v4/invoices/{id}`), sin host: el mismo evento es idéntico
   * en pruebas y en producción. Para leer el recurso use su servicio con `id`.
   */
  url: string;
}

/**
 * Tipos de evento de webhook, como llegan en `WebhookEvent.type`. Los de un cambio de estado nombran el estado al que
 * llegó el recurso. Son una ayuda para comparar: el catálogo puede crecer y un tipo desconocido se ignora.
 */
export const WebhookEventTypes = {
  /** La factura pasó de vigente a cancelación en proceso (`V` → `C`). */
  InvoiceCancellationRequested: 'invoice.cancellation_requested',
  /** La cancelación en proceso terminó y la factura quedó cancelada (`C` → `X`). */
  InvoiceCanceled: 'invoice.canceled',
  /** La cancelación en proceso se rechazó y la factura volvió a vigente (`C` → `V`). */
  InvoiceCancellationRejected: 'invoice.cancellation_rejected',
  /** La solicitud de descarga masiva terminó con éxito (→ `3`). */
  DownloadRequestCompleted: 'download_request.completed',
  /**
   * La solicitud de descarga masiva se abandonó (→ `-1`). No implica un error: el motivo está en la solicitud
   * (`client.downloadRequests.getById(id)`).
   */
  DownloadRequestAbandoned: 'download_request.abandoned',
  /** La regla de descarga masiva quedó suspendida (`2` → `4`). */
  DownloadRuleSuspended: 'download_rule.suspended',
  /**
   * Prueba de un endpoint: no se suscribe; solo llega al pulsar "Enviar prueba" (`POST webhook-endpoints/{id}/test`), y
   * solo a ese endpoint. Su `data.relatedObject` es el endpoint mismo (`webhook_endpoint`), sin persona ni estados.
   */
  WebhookEndpointTest: 'webhook_endpoint.test',
} as const;
