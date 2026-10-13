/**
 * `InvoiceItem.ticketId` (Auto CFDI): liga cada concepto de la factura global a su ticket. Los mismos escenarios viven
 * en los SDK de .NET, Python, PHP y Java: sin `ticketId` el cuerpo de `invoices.create` es exactamente el de la versión
 * anterior; con él, cada concepto lleva `"ticketId"` (un ticket puede ir en varios conceptos); un `ticketId` sin asignar
 * nunca viaja, y el 409 de tickets no disponibles trae `data.unavailableTickets` (en Node, dentro de `details`).
 */
import { FakeApi } from './fake-api';
import { InvoiceService } from '../src/services/invoice-service';
import { Invoice, InvoiceItem } from '../src/index';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';
const ISSUER_ID = '4b1c2d3e-0000-4000-8000-000000000002';
const TICKET_ID = '9f8e7d6c-0000-4000-8000-0000000000a1';
const OTHER_TICKET_ID = '9f8e7d6c-0000-4000-8000-0000000000a2';

// Cuerpo que enviaba la versión anterior del SDK (sin `ticketId` en `InvoiceItem`) para la misma global.
const PREVIOUS_PAYLOAD =
  '{"versionCode":"4.0","series":"G","number":"1001","date":"2026-10-01T10:00:00","paymentFormCode":"01",' +
  '"currencyCode":"MXN","typeCode":"I","expeditionZipCode":"06000","exportCode":"01","paymentMethodCode":"PUE",' +
  '"issuer":{"id":"4b1c2d3e-0000-4000-8000-000000000002"},"recipient":{"tin":"XAXX010101000",' +
  '"legalName":"PUBLICO EN GENERAL","zipCode":"06000","taxRegimeCode":"616","cfdiUseCode":"S01"},' +
  '"globalInformation":{"periodicityCode":"04","monthCode":"09","year":2026},"items":[' +
  '{"itemCode":"01010101","itemSku":"F-1001","quantity":1,"unitOfMeasurementCode":"ACT","description":"Venta",' +
  '"unitPrice":"100.00","taxObjectCode":"02","itemTaxes":[{"taxCode":"002","taxTypeCode":"Tasa",' +
  '"taxRate":"0.160000","taxFlagCode":"T"}]},' +
  '{"itemCode":"01010101","itemSku":"F-1001","quantity":1,"unitOfMeasurementCode":"ACT","description":"Venta",' +
  '"unitPrice":"50.00","taxObjectCode":"02","itemTaxes":[{"taxCode":"002","taxTypeCode":"Tasa",' +
  '"taxRate":"0.000000","taxFlagCode":"T"}]}]}';

const UNAVAILABLE_TICKETS_DETAILS =
  'Uno o más tickets ya no están disponibles para la factura global (solo entra un ticket en estado pending): ' +
  "'data.unavailableTickets' dice cuáles y su estado. No se cobró el timbre ni quedó tomado ningún ticket.";

// Un concepto por grupo de impuestos del mismo ticket: IVA 16 % y 0 %.
function concept(unitPrice: string, taxRate: string, ticketId?: string): InvoiceItem {
  const item: InvoiceItem = {
    itemCode: '01010101',
    itemSku: 'F-1001',
    quantity: 1,
    unitOfMeasurementCode: 'ACT',
    description: 'Venta',
    unitPrice,
    taxObjectCode: '02',
    itemTaxes: [{ taxCode: '002', taxTypeCode: 'Tasa', taxRate, taxFlagCode: 'T' }],
  };
  return ticketId === undefined ? item : { ...item, ticketId };
}

function globalInvoice(items: InvoiceItem[]): Invoice {
  return {
    versionCode: '4.0',
    series: 'G',
    number: '1001',
    date: '2026-10-01T10:00:00',
    paymentFormCode: '01',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '06000',
    exportCode: '01',
    paymentMethodCode: 'PUE',
    issuer: { id: ISSUER_ID },
    recipient: {
      tin: 'XAXX010101000',
      legalName: 'PUBLICO EN GENERAL',
      zipCode: '06000',
      taxRegimeCode: '616',
      cfdiUseCode: 'S01',
    },
    globalInformation: { periodicityCode: '04', monthCode: '09', year: 2026 },
    items,
  };
}

let api: FakeApi;
let invoices: InvoiceService;

beforeEach(() => {
  api = new FakeApi();
  invoices = new InvoiceService(api.httpClient, API_VERSION);
});

function sentBody(): Record<string, unknown> {
  expect(api.requests).toHaveLength(1);
  expect(api.requests[0].method).toBe('POST');
  expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/invoices`);
  return api.requests[0].body as Record<string, unknown>;
}

describe('InvoiceItem.ticketId', () => {
  test('sin ticketId, invoices.create envía exactamente el cuerpo de la versión anterior', async () => {
    await invoices.create(globalInvoice([concept('100.00', '0.160000'), concept('50.00', '0.000000')]));

    expect(JSON.stringify(sentBody())).toBe(PREVIOUS_PAYLOAD);
  });

  test('un ticketId sin asignar (undefined) no viaja', async () => {
    await invoices.create(globalInvoice([{ ...concept('100.00', '0.160000'), ticketId: undefined }]));

    const items = sentBody().items as Record<string, unknown>[];
    expect('ticketId' in items[0]).toBe(false);
  });

  test('con ticketId, cada concepto lo lleva y nada más cambia', async () => {
    await invoices.create(globalInvoice([
      concept('100.00', '0.160000', TICKET_ID),
      concept('50.00', '0.000000', TICKET_ID),
    ]));

    const expected = JSON.parse(PREVIOUS_PAYLOAD);
    expected.items.forEach((item: Record<string, unknown>) => { item.ticketId = TICKET_ID; });
    expect(sentBody()).toStrictEqual(expected);
  });

  test('solo los conceptos con ticketId lo llevan', async () => {
    await invoices.create(globalInvoice([concept('100.00', '0.160000'), concept('50.00', '0.000000', OTHER_TICKET_ID)]));

    const items = sentBody().items as Record<string, unknown>[];
    expect('ticketId' in items[0]).toBe(false);
    expect(items[1].ticketId).toBe(OTHER_TICKET_ID);
  });

  test('tickets no disponibles es 409 y details trae data.unavailableTickets', async () => {
    const body = {
      data: {
        unavailableTickets: [
          { ticketId: TICKET_ID, status: 'invoiced' },
          { ticketId: OTHER_TICKET_ID, status: 'globalizing' },
        ],
      },
      succeeded: false,
      message: "Sorry, it's not me, it's you.",
      details: UNAVAILABLE_TICKETS_DETAILS,
      httpStatusCode: 409,
    };
    api.respondWith(JSON.stringify(body), 409);

    const response = await invoices.create(globalInvoice([
      concept('100.00', '0.160000', TICKET_ID),
      concept('50.00', '0.000000', OTHER_TICKET_ID),
    ]));

    expect(response.succeeded).toBe(false);
    expect(response.httpStatusCode).toBe(409);
    const details = JSON.parse(response.details);
    expect(details.details).toBe(UNAVAILABLE_TICKETS_DETAILS);
    expect(details.data.unavailableTickets).toStrictEqual([
      { ticketId: TICKET_ID, status: 'invoiced' },
      { ticketId: OTHER_TICKET_ID, status: 'globalizing' },
    ]);
  });
});
