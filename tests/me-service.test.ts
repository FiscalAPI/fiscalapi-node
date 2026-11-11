/**
 * GET /api/v4/me: la persona de la credencial con sus features y saldos, con los nombres del back. Los mismos
 * escenarios viven en los SDK de .NET, Python, PHP y Java.
 */
import { FakeApi } from './fake-api';
import { MeService } from '../src/services/me-service';
import { CreditType, FiscalapiClient, MeInfo } from '../src/index';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';

const ME_RESPONSE = JSON.stringify({
  data: {
    id: '78d380fd-1b69-4e3c-8bc0-4f57737f7d5f',
    legalName: 'KARLA FUENTE NOLASCO',
    tin: 'FUNK671228PH6',
    email: 'persona@example.com',
    tenantId: '102e5f13-e114-41dd-bea7-507fce177281',
    environment: 'Test',
    isOwner: true,
    features: {
      isOwner: true,
      roles: ['Owner'],
      permissions: ['Invoices.Read', 'Invoices.Issue'],
      denied: { 'Tickets.Create': { missingFeatures: ['auto_cfdi'] } },
      features: { emision_cfdi: { values: {} }, descarga_cfdi: { values: { seats: 2 } } },
      subscription: { status: 'active', isAvailable: true },
      seatAssignments: [{ featureCode: 'descarga_cfdi', units: 1, status: 'Active' }],
    },
    balances: [
      { creditType: 1, available: 7 },
      { creditType: 2, available: 3 },
    ],
  },
  succeeded: true,
  message: '',
  details: '',
  httpStatusCode: 200,
});

let api: FakeApi;
let me: MeService;

beforeEach(() => {
  api = new FakeApi();
  api.respondWith(ME_RESPONSE);
  me = new MeService(api.httpClient, API_VERSION);
});

describe('me.get', () => {
  test('hace GET a /api/v4/me sin cuerpo', async () => {
    await me.get();

    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].method).toBe('GET');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/me`);
    expect(api.requests[0].body).toBeUndefined();
  });

  test('deserializa la persona, sus features y sus saldos', async () => {
    const response = await me.get();
    const info: MeInfo = response.data;

    expect(response.succeeded).toBe(true);
    expect(info.id).toBe('78d380fd-1b69-4e3c-8bc0-4f57737f7d5f');
    expect(info.legalName).toBe('KARLA FUENTE NOLASCO');
    expect(info.tin).toBe('FUNK671228PH6');
    expect(info.email).toBe('persona@example.com');
    expect(info.tenantId).toBe('102e5f13-e114-41dd-bea7-507fce177281');
    expect(info.environment).toBe('Test');
    expect(info.isOwner).toBe(true);

    const features = info.features;
    expect(features.isOwner).toBe(true);
    expect(features.roles).toEqual(['Owner']);
    expect(features.permissions).toEqual(['Invoices.Read', 'Invoices.Issue']);
    expect(features.denied['Tickets.Create'].missingFeatures).toEqual(['auto_cfdi']);
    expect(features.features.emision_cfdi.values).toEqual({});
    expect(features.features.descarga_cfdi.values.seats).toBe(2);
    expect(features.subscription).toEqual({ status: 'active', isAvailable: true });
    expect(features.seatAssignments).toEqual([{ featureCode: 'descarga_cfdi', units: 1, status: 'Active' }]);

    expect(info.balances).toEqual([
      { creditType: CreditType.Stamp, available: 7 },
      { creditType: CreditType.Validation, available: 3 },
    ]);
  });
});

test('el cliente expone el servicio me', () => {
  const client = FiscalapiClient.create({ apiUrl: BASE_URL, apiKey: 'sk_test_sdk', tenant: 'tenant-sdk' });

  expect(client.me).toBeInstanceOf(MeService);
});
