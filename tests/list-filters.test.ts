/**
 * Filtros de las listas de facturas, personas y productos (GET /api/v4/invoices, /people y /products). Los mismos
 * escenarios viven en los SDK de .NET, Python, PHP y Java: cada filtro asignado viaja en camelCase y escapado, uno sin
 * asignar no se envía, y sin filtros la query queda vacía. `getList(pageNumber, pageSize)` sigue igual.
 */
import { FakeApi } from './fake-api';
import { InvoiceService } from '../src/services/invoice-service';
import { PersonService } from '../src/services/person-service';
import { ProductService } from '../src/services/product-service';
import { TicketService } from '../src/services/ticket-service';
import { InvoiceListFilters, InvoiceListOrder, PersonListFilters, ProductListFilters } from '../src/index';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';

const EMPTY_PAGE = JSON.stringify({
  data: { items: [], pageNumber: 1, totalPages: 0, totalCount: 0, hasPreviousPage: false, hasNextPage: false },
  succeeded: true,
  message: '',
  details: '',
  httpStatusCode: 200,
});

let api: FakeApi;
let invoices: InvoiceService;
let persons: PersonService;
let products: ProductService;

beforeEach(() => {
  api = new FakeApi();
  api.respondWith(EMPTY_PAGE);
  invoices = new InvoiceService(api.httpClient, API_VERSION);
  persons = new PersonService(api.httpClient, API_VERSION);
  products = new ProductService(api.httpClient, API_VERSION);
});

const requestedUrls = (): string[] => api.requests.map((request) => request.url);

describe('invoices.getList', () => {
  test('envía cada filtro en el orden del contrato', async () => {
    const filters: InvoiceListFilters = {
      from: '2026-09-01',
      to: '2026-09-30',
      issuerTin: 'EKU9003173C9',
      recipientTin: 'FUNK671228PH6',
      typeCode: 'I',
      statusId: 'V',
      series: 'SDK-F',
      number: '1001',
      uuid: '5f2c7a1e-0000-4000-8000-0000000000c3',
      order: InvoiceListOrder.Desc,
      pageNumber: 2,
      pageSize: 50,
    };

    const response = await invoices.getList(filters);

    expect(response.succeeded).toBe(true);
    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].method).toBe('GET');
    expect(api.requests[0].body).toBeUndefined();
    expect(api.requests[0].url).toBe(
      `${BASE_URL}/api/v4/invoices?from=2026-09-01&to=2026-09-30&issuerTin=EKU9003173C9&recipientTin=FUNK671228PH6` +
        '&typeCode=I&statusId=V&series=SDK-F&number=1001&uuid=5f2c7a1e-0000-4000-8000-0000000000c3&order=desc' +
        '&pageNumber=2&pageSize=50',
    );
  });

  test('envía solo los filtros asignados', async () => {
    await invoices.getList({ statusId: 'X', order: 'asc' });

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/invoices?statusId=X&order=asc`]);
  });

  test('sin filtros, la ruta va sin query', async () => {
    await invoices.getList();
    await invoices.getList({});

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/invoices`, `${BASE_URL}/api/v4/invoices`]);
  });

  test('getList(pageNumber, pageSize) sigue igual', async () => {
    await invoices.getList(1, 10);

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/invoices?PageNumber=1&PageSize=10`]);
  });
});

describe('persons.getList', () => {
  test('envía search escapado, userTypeId y la página', async () => {
    const filters: PersonListFilters = { search: 'Ana María & Co', userTypeId: 'C', pageNumber: 1, pageSize: 20 };

    await persons.getList(filters);

    expect(requestedUrls()).toEqual([
      `${BASE_URL}/api/v4/people?search=Ana%20Mar%C3%ADa%20%26%20Co&userTypeId=C&pageNumber=1&pageSize=20`,
    ]);
  });

  test('envía solo los filtros asignados', async () => {
    await persons.getList({ userTypeId: 'U' });

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/people?userTypeId=U`]);
  });

  test('sin filtros, la ruta va sin query', async () => {
    await persons.getList();

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/people`]);
  });

  test('getList(pageNumber, pageSize) sigue igual', async () => {
    await persons.getList(3, 25);

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/people?PageNumber=3&PageSize=25`]);
  });
});

describe('products.getList', () => {
  test('envía search y la página', async () => {
    const filters: ProductListFilters = { search: '01010101', pageNumber: 3, pageSize: 5 };

    await products.getList(filters);

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/products?search=01010101&pageNumber=3&pageSize=5`]);
  });

  test('sin filtros, la ruta va sin query', async () => {
    await products.getList({});

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/products`]);
  });

  test('getList(pageNumber, pageSize) sigue igual', async () => {
    await products.getList(1, 2);

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/products?PageNumber=1&PageSize=2`]);
  });
});

describe('llamador sin tipos (JavaScript)', () => {
  test('un filtro en null no se envía, en las listas nuevas y en tickets', async () => {
    const filters = JSON.parse('{"statusId":null,"personId":null,"order":"desc"}');

    await invoices.getList(filters);
    await new TicketService(api.httpClient, API_VERSION).getList(filters);

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/invoices?order=desc`, `${BASE_URL}/api/v4/tickets`]);
  });

  test('getList con la página en texto sigue siendo getList(pageNumber, pageSize)', async () => {
    await persons.getList(JSON.parse('"2"'), JSON.parse('"20"'));

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/people?PageNumber=2&PageSize=20`]);
  });

  test('getList(null) es la lista sin filtros', async () => {
    await products.getList(JSON.parse('null'));

    expect(requestedUrls()).toEqual([`${BASE_URL}/api/v4/products`]);
  });
});
