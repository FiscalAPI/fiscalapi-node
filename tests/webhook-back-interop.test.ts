/**
 * Interoperabilidad con el back: una entrega firmada como la firma WebhookSigner de fapi-back (dos secretos durante una
 * rotación, el vigente primero) y con el sobre tal como lo serializa WebhookEnvelopeSerializer (camelCase, sin espacios,
 * createdAt al segundo con Z y las nulas presentes) verifica con Webhook.verify y se lee completa en WebhookEvent.
 */
import { Webhook, WebhookEventTypes } from '../src/index';
import type { WebhookEvent } from '../src/index';
import { generateSecret, signedHeaders } from './back-webhook-signer';

const EVENT_ID = '0f6b2c1e-7d3a-4e8b-9c51-2a4d6e8f0b13';
const PERSON_ID = '4b1c2d3e-0000-4000-8000-000000000002';
const INVOICE_ID = '9f8e7d6c-0000-4000-8000-0000000000a1';
const DOWNLOAD_REQUEST_ID = '3c2b1a09-0000-4000-8000-0000000000b7';
const ENDPOINT_ID = '6a5b4c3d-0000-4000-8000-0000000000c9';
const TIMESTAMP = 1791830873; // 2026-10-12T18:47:53Z, el createdAt de los sobres
const CREATED_AT_MS = Date.UTC(2026, 9, 12, 18, 47, 53);

// Los sobres de WebhookEnvelopeTests de fapi-back, con ids fijos.
const CANCELED_INVOICE_BODY =
  '{"id":"0f6b2c1e-7d3a-4e8b-9c51-2a4d6e8f0b13","type":"invoice.canceled","createdAt":"2026-10-12T18:47:53Z","personId":"4b1c2d3e-0000-4000-8000-000000000002","data":{"relatedObject":{"id":"9f8e7d6c-0000-4000-8000-0000000000a1","type":"invoice","url":"/api/v4/invoices/9f8e7d6c-0000-4000-8000-0000000000a1"},"status":"X","previousStatus":"C"}}';

const COMPLETED_DOWNLOAD_REQUEST_BODY =
  '{"id":"0f6b2c1e-7d3a-4e8b-9c51-2a4d6e8f0b13","type":"download_request.completed","createdAt":"2026-10-12T18:47:53Z","personId":null,"data":{"relatedObject":{"id":"3c2b1a09-0000-4000-8000-0000000000b7","type":"download_request","url":"/api/v4/download-requests/3c2b1a09-0000-4000-8000-0000000000b7"},"status":null,"previousStatus":null}}';

// El sobre de WebhookEvent.EndpointTest del back (POST webhook-endpoints/{id}/test): el recurso es el endpoint.
const ENDPOINT_TEST_BODY =
  '{"id":"0f6b2c1e-7d3a-4e8b-9c51-2a4d6e8f0b13","type":"webhook_endpoint.test","createdAt":"2026-10-12T18:47:53Z","personId":null,"data":{"relatedObject":{"id":"6a5b4c3d-0000-4000-8000-0000000000c9","type":"webhook_endpoint","url":"/api/v4/webhook-endpoints/6a5b4c3d-0000-4000-8000-0000000000c9"},"status":null,"previousStatus":null}}';

function verifyDelivered(body: string, receiverSecrets: string[], ...signingSecrets: string[]): WebhookEvent {
  jest.spyOn(Date, 'now').mockReturnValue(TIMESTAMP * 1000);
  return Webhook.verify(signedHeaders(EVENT_ID, TIMESTAMP, body, ...signingSecrets), body, receiverSecrets);
}

const originalTimeZone = process.env.TZ;

afterEach(() => {
  jest.restoreAllMocks();
  if (originalTimeZone === undefined) {
    delete process.env.TZ;
  } else {
    process.env.TZ = originalTimeZone;
  }
});

test('una entrega del back firmada durante una rotación verifica con cualquiera de los dos secretos y se lee completa', () => {
  const current = generateSecret();
  const previous = generateSecret();

  for (const receiverSecret of [current, previous]) {
    const event = verifyDelivered(CANCELED_INVOICE_BODY, [receiverSecret], current, previous);

    expect(event.id).toBe(EVENT_ID);
    expect(event.type).toBe(WebhookEventTypes.InvoiceCanceled);
    expect(event.createdAt).toBeInstanceOf(Date);
    expect(event.createdAt.getTime()).toBe(CREATED_AT_MS);
    expect(event.personId).toBe(PERSON_ID);
    expect(event.data.relatedObject.id).toBe(INVOICE_ID);
    expect(event.data.relatedObject.type).toBe('invoice');
    expect(event.data.relatedObject.url).toBe(`/api/v4/invoices/${INVOICE_ID}`);
    expect(event.data.status).toBe('X');
    expect(event.data.previousStatus).toBe('C');
  }
});

test('una entrega del back sin persona ni estados los lee como null', () => {
  const secret = generateSecret();

  const event = verifyDelivered(COMPLETED_DOWNLOAD_REQUEST_BODY, [secret], secret);

  expect(event.type).toBe(WebhookEventTypes.DownloadRequestCompleted);
  expect(event.personId).toBeNull();
  expect(event.data.relatedObject.id).toBe(DOWNLOAD_REQUEST_ID);
  expect(event.data.relatedObject.type).toBe('download_request');
  expect(event.data.relatedObject.url).toBe(`/api/v4/download-requests/${DOWNLOAD_REQUEST_ID}`);
  expect(event.data.status).toBeNull();
  expect(event.data.previousStatus).toBeNull();
});

test('un tipo y campos desconocidos se leen sin error', () => {
  const body =
    '{"id":"evt_1","type":"invoice.future_state","createdAt":"2026-10-12T18:47:53Z","personId":null,"extra":1,"data":{"relatedObject":{"id":"r1","type":"future_resource","url":"/api/v4/future/r1","extra":true},"status":"Z","previousStatus":null}}';
  const secret = generateSecret();

  const event = verifyDelivered(body, [secret], secret);

  expect(event.type).toBe('invoice.future_state');
  expect(event.data.relatedObject.type).toBe('future_resource');
  expect(event.data.status).toBe('Z');
});

test('una entrega de prueba del back apunta al endpoint, sin persona ni estados', () => {
  const secret = generateSecret();

  const event = verifyDelivered(ENDPOINT_TEST_BODY, [secret], secret);

  expect(event.type).toBe(WebhookEventTypes.WebhookEndpointTest);
  expect(event.personId).toBeNull();
  expect(event.data.relatedObject).toEqual({
    id: ENDPOINT_ID,
    type: 'webhook_endpoint',
    url: `/api/v4/webhook-endpoints/${ENDPOINT_ID}`,
  });
  expect(event.data.status).toBeNull();
  expect(event.data.previousStatus).toBeNull();
});

test('las constantes de tipo son los tipos del back', () => {
  expect(WebhookEventTypes).toEqual({
    InvoiceCancellationRequested: 'invoice.cancellation_requested',
    InvoiceCanceled: 'invoice.canceled',
    InvoiceCancellationRejected: 'invoice.cancellation_rejected',
    DownloadRequestCompleted: 'download_request.completed',
    DownloadRequestAbandoned: 'download_request.abandoned',
    DownloadRuleSuspended: 'download_rule.suspended',
    WebhookEndpointTest: 'webhook_endpoint.test',
  });
});

describe('createdAt se lee en UTC, aislado de la zona horaria del proceso del integrador', () => {
  test.each([
    ['con Z', '2026-10-12T18:47:53Z'],
    ['sin zona', '2026-10-12T18:47:53'],
    ['con fracción', '2026-10-12T18:47:53.000Z'],
    ['con desplazamiento', '2026-10-12T12:47:53-06:00'],
  ])('%s', (_, createdAt) => {
    process.env.TZ = 'America/Mexico_City';
    const body = `{"id":"evt_1","type":"invoice.canceled","createdAt":"${createdAt}","personId":null,"data":{"relatedObject":{"id":"r1","type":"invoice","url":"/api/v4/invoices/r1"},"status":"X","previousStatus":"C"}}`;
    const secret = generateSecret();

    const event = verifyDelivered(body, [secret], secret);

    expect(event.createdAt.getTime()).toBe(CREATED_AT_MS);
  });

  test.each([
    'ayer',
    '2026-13-45T99:99:99Z',
    '1791830873',
    '2026-02-30T00:00:00Z',
    '2026-10-12T24:00:00Z',
    '2026-10-12T18:47:60Z',
    '2026-10-12T18:47:53+24:00',
  ])('un createdAt que no es una fecha ISO 8601 posible se rechaza nombrando el campo: "%s"', (createdAt) => {
    const body = `{"id":"evt_1","type":"invoice.canceled","createdAt":"${createdAt}","personId":null,"data":null}`;
    const secret = generateSecret();

    expect(() => verifyDelivered(body, [secret], secret)).toThrow(/no es un evento.*createdAt/);
  });
});

describe('validación mínima del sobre, después de la firma', () => {
  test.each([
    ['id', 'texto', '{"id":5,"type":"invoice.canceled"}'],
    ['type', 'texto', '{"id":"evt_1","type":{"x":1}}'],
    ['createdAt', 'texto', '{"id":"evt_1","createdAt":1791830873}'],
    ['data', 'un objeto', '{"id":"evt_1","data":"texto"}'],
    ['data', 'un objeto', '{"id":"evt_1","data":[]}'],
    ['relatedObject', 'un objeto', '{"id":"evt_1","data":{"relatedObject":"r1"}}'],
  ])('un %s que no es %s se rechaza nombrando el campo', (field, kind, body) => {
    const secret = generateSecret();

    expect(() => verifyDelivered(body, [secret], secret)).toThrow(`no es un evento de webhook: el campo ${field} no es ${kind}.`);
  });

  test('los campos ausentes o nulos se aceptan', () => {
    const body = '{"id":null,"type":null,"createdAt":null,"data":{"relatedObject":null,"status":null}}';
    const secret = generateSecret();

    expect(verifyDelivered(body, [secret], secret).data.relatedObject).toBeNull();
  });
});
