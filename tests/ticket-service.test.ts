/**
 * Servicio de tickets de Auto CFDI (POST/GET/DELETE /api/v4/tickets). Los mismos escenarios viven en los SDK de .NET,
 * Python, PHP y Java: el cuerpo exacto de la ingesta y el header Idempotency-Key solo si se pasa; las respuestas 201 y
 * 200 de la ingesta; el 409 y el 422 con la forma de error del SDK (en Node, `details` lleva el cuerpo del error en
 * JSON, con su `data`); la query de la lista con `status` repetido; el detalle con y sin `details`; el código; la
 * cancelación con DELETE, y un estado que el SDK no conoce, conservado como texto.
 */
import { FakeApi } from './fake-api';
import { TicketService } from '../src/services/ticket-service';
import { Ticket, TicketActorType, TicketEventType, TicketStatus } from '../src/index';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';
const ISSUER_ID = '4b1c2d3e-0000-4000-8000-000000000002';
const TICKET_ID = '9f8e7d6c-0000-4000-8000-0000000000a1';
const IDEMPOTENCY_KEY = 'pos-01-F-1001';

const ok = (data: unknown, httpStatusCode = 200): string =>
  JSON.stringify({ data, succeeded: true, message: '', details: '', httpStatusCode });

const INGESTED = {
  id: TICKET_ID,
  ticketCode: 'K7M2Q9X4TB3H',
  qrUrl: 'https://portal.fiscalapi.com/t/K7M2Q9X4TB3H',
  status: 'pending',
  selfInvoiceEligible: true,
  eligibleUntil: '2026-10-31T23:59:59.000',
  subtotal: 100,
  totalTransferredTaxes: 16,
  totalWithheldTaxes: 0,
  total: 116,
};

const SUMMARY = {
  id: TICKET_ID,
  personId: ISSUER_ID,
  folio: 'F-1001',
  series: 'A',
  paymentDate: '2026-09-01T00:00:00.000',
  paymentFormCode: '01',
  currencyCode: 'MXN',
  exchangeRate: null,
  expeditionZipCode: '06000',
  subtotal: 100,
  totalTransferredTaxes: 16,
  totalWithheldTaxes: 0,
  total: 116,
  status: 'pending',
  selfInvoiceEligible: true,
  eligibleUntil: '2026-09-30T23:59:59.000',
  invoiceId: null,
  globalInvoiceId: null,
  createdAt: '2026-09-01T00:05:00.000',
};

const DETAIL = {
  ...SUMMARY,
  status: 'cancelled',
  selfInvoiceEligible: false,
  eligibleUntil: null,
  items: [
    {
      itemCode: '50202306',
      itemSku: 'SKU-1',
      quantity: 1,
      unitOfMeasurementCode: 'H87',
      description: 'Refresco',
      unitPrice: 100,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [{ taxCode: '002', taxTypeCode: 'Tasa', taxRate: 0.16, taxFlagCode: 'T' }],
    },
  ],
  events: [
    { type: 'ingested', occurredAt: '2026-09-01T00:05:00.000', actorType: 'tenant', invoiceId: null },
    { type: 'cancelled', occurredAt: '2026-09-01T01:00:00.000', actorType: 'tenant', invoiceId: null },
  ],
};

// Lo que arma el integrador: los decimales en texto conservan sus ceros finales al serializar.
const newTicket = (): Ticket => ({
  issuer: { id: ISSUER_ID },
  folio: 'F-1001',
  series: 'A',
  paymentDate: '2026-10-15T12:30:00',
  paymentFormCode: '01',
  currencyCode: 'MXN',
  expeditionZipCode: '06000',
  total: '116.00',
  items: [
    {
      itemCode: '50202306',
      itemSku: 'SKU-1',
      quantity: 1.5,
      unitOfMeasurementCode: 'H87',
      description: 'Refresco',
      unitPrice: '66.666667',
      discount: '0.00',
      taxObjectCode: '02',
      itemTaxes: [{ taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' }],
    },
  ],
});

// El cuerpo exacto que recibe el API: nombres camelCase, decimales tal cual y sin miembros que no se asignaron.
const EXPECTED_CREATE_BODY = {
  issuer: { id: ISSUER_ID },
  folio: 'F-1001',
  series: 'A',
  paymentDate: '2026-10-15T12:30:00',
  paymentFormCode: '01',
  currencyCode: 'MXN',
  expeditionZipCode: '06000',
  total: '116.00',
  items: [
    {
      itemCode: '50202306',
      itemSku: 'SKU-1',
      quantity: 1.5,
      unitOfMeasurementCode: 'H87',
      description: 'Refresco',
      unitPrice: '66.666667',
      discount: '0.00',
      taxObjectCode: '02',
      itemTaxes: [{ taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' }],
    },
  ],
};

let api: FakeApi;
let tickets: TicketService;

beforeEach(() => {
  api = new FakeApi();
  tickets = new TicketService(api.httpClient, API_VERSION);
});

describe('a. cuerpo e Idempotency-Key', () => {
  test('create envía el contrato exacto con el header Idempotency-Key', async () => {
    api.respondWith(ok(INGESTED, 201), 201);

    await tickets.create(newTicket(), IDEMPOTENCY_KEY);

    expect(api.requests).toHaveLength(1);
    const [request] = api.requests;
    expect(request.method).toBe('POST');
    expect(request.url).toBe(`${BASE_URL}/api/v4/tickets`);
    expect(request.body).toStrictEqual(EXPECTED_CREATE_BODY);
    expect(request.headers['Idempotency-Key']).toBe(IDEMPOTENCY_KEY);
  });

  test('create sin key no envía el header Idempotency-Key', async () => {
    api.respondWith(ok(INGESTED, 201), 201);

    await tickets.create(newTicket());

    const [request] = api.requests;
    expect(request.body).toStrictEqual(EXPECTED_CREATE_BODY);
    expect(request.headers).not.toHaveProperty('Idempotency-Key');
  });
});

describe('b. respuestas de la ingesta', () => {
  test.each([201, 200])('create lee el ticket ingerido con la misma forma en el %i', async (status) => {
    api.respondWith(ok(INGESTED, status), status);

    const response = await tickets.create(newTicket(), IDEMPOTENCY_KEY);

    expect(response.succeeded).toBe(true);
    expect(response.httpStatusCode).toBe(status);
    expect(response.data).toStrictEqual(INGESTED);
    expect(response.data.status).toBe(TicketStatus.Pending);
  });

  test('un folio activo es 409 y details trae el cuerpo con data.existingTicketId', async () => {
    const body = {
      data: { existingTicketId: TICKET_ID },
      succeeded: false,
      message: "Sorry, it's not me, it's you.",
      details:
        "Ya hay un ticket activo con esa serie y folio para el emisor: 'data.existingTicketId' es el ticket que lo tiene. Para volver a ingerirlo, cancela ese ticket primero.",
      httpStatusCode: 409,
    };
    api.respondWith(JSON.stringify(body), 409);

    const response = await tickets.create(newTicket());

    expect(response.succeeded).toBe(false);
    expect(response.httpStatusCode).toBe(409);
    expect(JSON.parse(response.details).data.existingTicketId).toBe(TICKET_ID);
  });

  test('un total que no cuadra es 422 y details trae data.expectedTotal y data.computedTotal', async () => {
    const body = {
      data: { expectedTotal: 116.01, computedTotal: 116 },
      succeeded: false,
      message: "Sorry, it's not me, it's you.",
      details:
        "'total' no cuadra al centavo con el total calculado de los conceptos e impuestos: 'data.expectedTotal' es el enviado y 'data.computedTotal' el calculado.",
      httpStatusCode: 422,
    };
    api.respondWith(JSON.stringify(body), 422);

    const response = await tickets.create(newTicket());

    expect(response.succeeded).toBe(false);
    expect(response.httpStatusCode).toBe(422);
    expect(JSON.parse(response.details).data).toStrictEqual({ expectedTotal: 116.01, computedTotal: 116 });
  });
});

describe('c. lista con filtros', () => {
  test('getList envía cada filtro y repite status', async () => {
    const page = { items: [SUMMARY], pageNumber: 2, totalPages: 3, totalCount: 21, hasPreviousPage: true, hasNextPage: true };
    api.respondWith(ok(page));

    const response = await tickets.getList({
      status: [TicketStatus.Pending, TicketStatus.Invoiced],
      personId: ISSUER_ID,
      from: '2026-09-01',
      to: '2026-09-30',
      pageNumber: 2,
      pageSize: 50,
    });

    const [request] = api.requests;
    expect(request.method).toBe('GET');
    expect(request.url).toBe(
      `${BASE_URL}/api/v4/tickets?status=pending&status=invoiced&personId=${ISSUER_ID}&from=2026-09-01&to=2026-09-30&pageNumber=2&pageSize=50`,
    );
    expect(response.data).toStrictEqual(page);
  });

  test('getList sin filtros no envía query', async () => {
    api.respondWith(ok({ items: [], pageNumber: 1, totalPages: 0, totalCount: 0, hasPreviousPage: false, hasNextPage: false }));

    await tickets.getList();

    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/tickets`);
  });
});

describe('d. detalle', () => {
  test('getById sin details no pide los detalles', async () => {
    api.respondWith(ok(SUMMARY));

    const response = await tickets.getById(TICKET_ID);

    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/tickets/${TICKET_ID}`);
    expect(response.data).toStrictEqual(SUMMARY);
  });

  test('getById con details lee conceptos e historia', async () => {
    api.respondWith(ok(DETAIL));

    const response = await tickets.getById(TICKET_ID, true);

    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/tickets/${TICKET_ID}?details=true`);
    expect(response.data).toStrictEqual(DETAIL);
    expect(response.data.status).toBe(TicketStatus.Cancelled);
    expect(response.data.events?.map((e) => e.type)).toEqual([TicketEventType.Ingested, TicketEventType.Cancelled]);
    expect(response.data.events?.every((e) => e.actorType === TicketActorType.Tenant)).toBe(true);
  });
});

describe('e. código', () => {
  test('getCode lee el código y la URL del QR', async () => {
    const code = { ticketCode: 'K7M2Q9X4TB3H', qrUrl: 'https://portal.fiscalapi.com/t/K7M2Q9X4TB3H' };
    api.respondWith(ok(code));

    const response = await tickets.getCode(TICKET_ID);

    expect(api.requests[0].method).toBe('GET');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/tickets/${TICKET_ID}/code`);
    expect(response.data).toStrictEqual(code);
  });
});

describe('f. cancelación', () => {
  test('cancel usa DELETE', async () => {
    api.respondWith(ok(true));

    const response = await tickets.cancel(TICKET_ID);

    expect(api.requests[0].method).toBe('DELETE');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/tickets/${TICKET_ID}`);
    expect(api.requests[0].body).toBeUndefined();
    expect(response.data).toBe(true);
  });
});

describe('g. valores que el SDK no conoce', () => {
  test('un estado, tipo de hecho y actor desconocidos llegan tal cual', async () => {
    api.respondWith(
      ok({
        ...DETAIL,
        status: 'unknownState',
        events: [{ type: 'unknownEvent', occurredAt: '2026-09-01T00:05:00.000', actorType: 'unknownActor', invoiceId: null }],
      }),
    );

    const response = await tickets.getById(TICKET_ID, true);

    expect(response.succeeded).toBe(true);
    expect(response.data.status).toBe('unknownState');
    expect(response.data.events?.[0].type).toBe('unknownEvent');
    expect(response.data.events?.[0].actorType).toBe('unknownActor');
  });
});

describe('id obligatorio', () => {
  test.each(['', ' '])('getById, getCode y cancel rechazan el id %p sin llamar al API', async (id) => {
    await expect(tickets.getById(id)).rejects.toThrow('id cannot be null or empty');
    await expect(tickets.getCode(id)).rejects.toThrow('id cannot be null or empty');
    await expect(tickets.cancel(id)).rejects.toThrow('id cannot be null or empty');
    expect(api.requests).toHaveLength(0);
  });
});
