/**
 * Llave de idempotencia opcional en `invoices.create` (POST /api/v4/invoices) y `stamps.transferStamps`
 * (POST /api/v4/stamps): con una llave de idempotencia, la petición lleva el header `Idempotency-Key` con ese valor; sin ella, no lo lleva.
 * El cuerpo no cambia en ninguno de los dos casos.
 */
import { FakeApi } from './fake-api';
import { InvoiceService } from '../src/services/invoice-service';
import { StampService } from '../src/services/stamp-service';
import { Invoice } from '../src/index';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';
const ISSUER_ID = '4b1c2d3e-0000-4000-8000-000000000002';
const PERSON_ID = '4b1c2d3e-0000-4000-8000-000000000003';
const IDEMPOTENCY_KEY = 'pos-01-F-1001';

const OK_BODY = '{"data":true,"succeeded":true,"message":"","details":"","httpStatusCode":200}';

function globalInvoice(): Invoice {
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
    items: [],
  };
}

let api: FakeApi;

beforeEach(() => {
  api = new FakeApi();
  api.respondWith(OK_BODY);
});

describe('invoices.create con Idempotency-Key', () => {
  test('con llave de idempotencia, envía el header Idempotency-Key con ese valor', async () => {
    const invoice = globalInvoice();

    await new InvoiceService(api.httpClient, API_VERSION).create(invoice, IDEMPOTENCY_KEY);

    expect(api.requests).toHaveLength(1);
    const [request] = api.requests;
    expect(request.method).toBe('POST');
    expect(request.url).toBe(`${BASE_URL}/api/v4/invoices`);
    expect(request.body).toStrictEqual(JSON.parse(JSON.stringify(invoice)));
    expect(request.headers['Idempotency-Key']).toBe(IDEMPOTENCY_KEY);
  });

  test('sin llave de idempotencia, no envía el header Idempotency-Key', async () => {
    await new InvoiceService(api.httpClient, API_VERSION).create(globalInvoice());

    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].headers).not.toHaveProperty('Idempotency-Key');
  });
});

describe('stamps.transferStamps con Idempotency-Key', () => {
  const transfer = {
    fromPersonId: '1',
    toPersonId: PERSON_ID,
    amount: 25,
  };

  test('con llave de idempotencia, envía el header Idempotency-Key con ese valor', async () => {
    await new StampService(api.httpClient, API_VERSION).transferStamps(transfer, IDEMPOTENCY_KEY);

    expect(api.requests).toHaveLength(1);
    const [request] = api.requests;
    expect(request.method).toBe('POST');
    expect(request.url).toBe(`${BASE_URL}/api/v4/stamps`);
    expect(request.body).toStrictEqual(transfer);
    expect(request.headers['Idempotency-Key']).toBe(IDEMPOTENCY_KEY);
  });

  test('sin llave de idempotencia, no envía el header Idempotency-Key', async () => {
    await new StampService(api.httpClient, API_VERSION).transferStamps(transfer);

    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].headers).not.toHaveProperty('Idempotency-Key');
  });
});
