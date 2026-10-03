/**
 * Tolerancia del SDK a respuestas que el API devolverá en las próximas fases (SDK-001).
 *
 * Son pruebas de caracterización: fijan el comportamiento ACTUAL. Una prueba cuyo nombre cita
 * SDK-011 documenta lo que esa tarea cambia. Los casos son:
 *  1. una transacción de timbres con `creditType: 3` (créditos de ticket, Fase 1);
 *  2. una persona con el campo nuevo `availableTicketBalance` (Fase 1);
 *  3. propiedades desconocidas en la envoltura, en `data` y en objetos anidados;
 *  4. `globalInformation` en la respuesta de una factura (BE-008).
 *
 * El SDK no transforma las respuestas: el JSON llega tal cual detrás de los tipos.
 */
import { FakeApi, readFixture } from './fake-api';
import { StampService } from '../src/services/stamp-service';
import { PersonService } from '../src/services/person-service';
import { InvoiceService } from '../src/services/invoice-service';
import { CreditType, StampTransaction } from '../src/models/stamp';
import { GlobalInformation } from '../src/models/invoice';
import { ApiResponse } from '../src/common/api-response';
import { PagedList } from '../src/common/paged-list';

const TICKET_CREDIT_TYPE = 3;
const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';

let api: FakeApi;

beforeEach(() => {
  api = new FakeApi();
});

describe('1. creditType: 3', () => {
  test('la lista conserva creditType 3 como número sin miembro en CreditType (SDK-011 agrega CreditType.Ticket)', async () => {
    api.respondWith(readFixture('stamps-page-credit-type-3.json'));

    const response: ApiResponse<PagedList<StampTransaction>> = await new StampService(api.httpClient, API_VERSION).getList(1, 10);

    expect(response.succeeded).toBe(true);
    expect(response.data.items.map((t: StampTransaction) => t.creditType)).toEqual([
      CreditType.Stamp,
      CreditType.Validation,
      TICKET_CREDIT_TYPE,
    ]);
    expect(Object.values(CreditType)).not.toContain(TICKET_CREDIT_TYPE);
    expect(api.requestedUrls).toEqual([`${BASE_URL}/api/v4/stamps?PageNumber=1&PageSize=10`]);
  });

  test('getById conserva creditType 3 como número', async () => {
    api.respondWith(readFixture('stamp-credit-type-3.json'));

    const response: ApiResponse<StampTransaction> = await new StampService(api.httpClient, API_VERSION).getById('8d0f6a52-6f1e-4c3a-9a10-000000000103');

    expect(response.succeeded).toBe(true);
    expect(response.data.creditType).toBe(TICKET_CREDIT_TYPE);
    expect(response.data.amount).toBe(25);
  });
});

describe('2. availableTicketBalance', () => {
  test('la persona conserva availableTicketBalance en tiempo de ejecución, sin tiparlo (SDK-011 lo agrega a Person)', async () => {
    api.respondWith(readFixture('person-ticket-balance.json'));

    const response = await new PersonService(api.httpClient, API_VERSION).getById('4b1c2d3e-0000-4000-8000-000000000001');

    expect(response.succeeded).toBe(true);
    expect(response.data.availableBalance).toBe(100);
    expect(response.data.availableValidationBalance).toBe(50);
    expect(response.data).toHaveProperty('availableTicketBalance', 25);
  });
});

describe('3. propiedades desconocidas', () => {
  test('se conservan sin error en la envoltura, en la página, en data y en objetos anidados', async () => {
    api.respondWith(readFixture('stamps-page-credit-type-3.json'));

    const response: ApiResponse<PagedList<StampTransaction>> = await new StampService(api.httpClient, API_VERSION).getList(1, 10);

    const ticketTransaction: StampTransaction = response.data.items[2];
    expect(response.succeeded).toBe(true);
    expect(response.httpStatusCode).toBe(200);
    expect(response).toHaveProperty('unknownEnvelopeField', 'envelope');
    expect(response.data).toHaveProperty('unknownPageField', { cursor: 'c-1' });
    expect(response.data.totalPages).toBe(1);
    expect(ticketTransaction).toHaveProperty('unknownObjectField', { code: 'T', enabled: true });
    expect(ticketTransaction).toHaveProperty('unknownArrayField', [1, 2, 3]);
    expect(ticketTransaction.fromPerson).toHaveProperty('unknownNestedField', ['nested', 'array']);
    expect(ticketTransaction.fromPerson?.legalName).toBe('FISCALAPI');
  });
});

describe('4. globalInformation en la respuesta de una factura (BE-008)', () => {
  test('se lee el objeto completo', async () => {
    api.respondWith(readFixture('invoice-global-information.json'));

    const response = await new InvoiceService(api.httpClient, API_VERSION).getById('3f2a9c1e-0b7d-4e55-9a61-2c8f0e4d7b10');

    const expected: GlobalInformation = { periodicityCode: '04', monthCode: '09', year: 2026 };
    expect(response.succeeded).toBe(true);
    expect(response.data.globalInformation).toEqual(expected);
    expect(response.data.issuer?.tin).toBe('EKU9003173C9');
  });

  test('null se lee como null', async () => {
    api.respondWith(readFixture('invoice-global-information-null.json'));

    const response = await new InvoiceService(api.httpClient, API_VERSION).getById('3f2a9c1e-0b7d-4e55-9a61-2c8f0e4d7b10');

    expect(response.succeeded).toBe(true);
    expect(response.data.globalInformation).toBeNull();
  });

  test('un objeto con miembros null se entrega sin error, con los null que tipa como string y number', async () => {
    api.respondWith(readFixture('invoice-global-information-null-members.json'));

    const response = await new InvoiceService(api.httpClient, API_VERSION).getById('3f2a9c1e-0b7d-4e55-9a61-2c8f0e4d7b10');

    expect(response.succeeded).toBe(true);
    expect(response.data.globalInformation).toEqual({ periodicityCode: null, monthCode: null, year: null });
  });
});
