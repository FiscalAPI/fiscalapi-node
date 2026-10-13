/**
 * Tolerancia del SDK a respuestas del API con valores y campos que el SDK modela o todavía no conoce.
 *
 * Los casos son:
 *  1. transacciones con `creditType: 3` (`CreditType.Ticket`) y con un tipo de crédito que el SDK no conoce (99);
 *  2. una persona con el saldo de créditos de ticket en `balances`;
 *  3. propiedades desconocidas en la envoltura, en `data` y en objetos anidados;
 *  4. `globalInformation` en la respuesta de una factura.
 *
 * El SDK no transforma las respuestas: el JSON llega tal cual detrás de los tipos.
 */
import { FakeApi, readFixture } from './fake-api';
import { StampService } from '../src/services/stamp-service';
import { PersonService } from '../src/services/person-service';
import { InvoiceService } from '../src/services/invoice-service';
import { CreditType, StampTransaction } from '../src/models/stamp';
import { CreditBalance } from '../src/models/person';
import { GlobalInformation } from '../src/models/invoice';
import { ApiResponse } from '../src/common/api-response';
import { PagedList } from '../src/common/paged-list';

const TICKET_CREDIT_TYPE = 3;
const UNKNOWN_CREDIT_TYPE = 99;
const TICKET_TRANSACTION_ID = '8d0f6a52-6f1e-4c3a-9a10-000000000103';
const PERSON_ID = '4b1c2d3e-0000-4000-8000-000000000001';
const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';

let api: FakeApi;

beforeEach(() => {
  api = new FakeApi();
});

/** La fixture con el creditType 3 de la transacción de tickets cambiado por otro valor. */
function withCreditType(fixture: string, creditType: number): string {
  return fixture.replace(`"creditType": ${TICKET_CREDIT_TYPE}`, `"creditType": ${creditType}`);
}

describe('1. creditType: 3 (Ticket) y un tipo desconocido', () => {
  test('la lista lee creditType 3 como CreditType.Ticket', async () => {
    api.respondWith(readFixture('stamps-page-credit-type-3.json'));

    const response: ApiResponse<PagedList<StampTransaction>> = await new StampService(api.httpClient, API_VERSION).getList(1, 10);

    expect(response.succeeded).toBe(true);
    expect(response.data.items.map((t: StampTransaction) => t.creditType)).toEqual([
      CreditType.Stamp,
      CreditType.Validation,
      CreditType.Ticket,
    ]);
    expect(Object.values(CreditType)).toContain(TICKET_CREDIT_TYPE);
    expect(api.requestedUrls).toEqual([`${BASE_URL}/api/v4/stamps?PageNumber=1&PageSize=10`]);
  });

  test('getById lee creditType 3 como CreditType.Ticket', async () => {
    api.respondWith(readFixture('stamp-credit-type-3.json'));

    const response: ApiResponse<StampTransaction> = await new StampService(api.httpClient, API_VERSION).getById(TICKET_TRANSACTION_ID);

    expect(response.succeeded).toBe(true);
    expect(response.data.creditType).toBe(CreditType.Ticket);
    expect(response.data.amount).toBe(25);
  });

  test('la lista conserva un creditType desconocido (99) como número sin miembro en CreditType', async () => {
    api.respondWith(withCreditType(readFixture('stamps-page-credit-type-3.json'), UNKNOWN_CREDIT_TYPE));

    const response: ApiResponse<PagedList<StampTransaction>> = await new StampService(api.httpClient, API_VERSION).getList(1, 10);

    expect(response.succeeded).toBe(true);
    expect(response.data.items.map((t: StampTransaction) => t.creditType)).toEqual([
      CreditType.Stamp,
      CreditType.Validation,
      UNKNOWN_CREDIT_TYPE,
    ]);
    expect(Object.values(CreditType)).not.toContain(UNKNOWN_CREDIT_TYPE);
  });

  test('getById conserva un creditType desconocido (99) como número', async () => {
    api.respondWith(withCreditType(readFixture('stamp-credit-type-3.json'), UNKNOWN_CREDIT_TYPE));

    const response: ApiResponse<StampTransaction> = await new StampService(api.httpClient, API_VERSION).getById(TICKET_TRANSACTION_ID);

    expect(response.succeeded).toBe(true);
    expect(response.data.creditType).toBe(UNKNOWN_CREDIT_TYPE);
    expect(response.data.amount).toBe(25);
  });

  test('transferStamps con CreditType.Ticket envía creditType 3', async () => {
    api.respondWith('{"data":true,"succeeded":true,"message":"","details":"","httpStatusCode":200}');

    const response: ApiResponse<boolean> = await new StampService(api.httpClient, API_VERSION).transferStamps({
      fromPersonId: '1',
      toPersonId: PERSON_ID,
      amount: 25,
      creditType: CreditType.Ticket,
    });

    expect(response.succeeded).toBe(true);
    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].method).toBe('POST');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/stamps`);
    expect(api.requests[0].body).toHaveProperty('creditType', TICKET_CREDIT_TYPE);
  });
});

describe('2. saldo de créditos de ticket en balances', () => {
  test('la persona trae el saldo de créditos de ticket en balances', async () => {
    api.respondWith(readFixture('person-ticket-balance.json'));

    const response = await new PersonService(api.httpClient, API_VERSION).getById(PERSON_ID);

    const expected: CreditBalance[] = [
      { creditType: CreditType.Stamp, available: 100 },
      { creditType: CreditType.Validation, available: 50 },
      { creditType: CreditType.Ticket, available: 25 },
    ];
    expect(response.succeeded).toBe(true);
    expect(response.data.availableBalance).toBe(100);
    expect(response.data.availableValidationBalance).toBe(50);
    expect(response.data.balances).toEqual(expected);
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

describe('4. globalInformation en la respuesta de una factura', () => {
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
