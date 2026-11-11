/**
 * Lista de certificados de una persona (GET /api/v4/people/{personId}/tax-files): solo metadatos, sin base64File ni
 * password, con el envelope ApiResponse y `data` como arreglo no paginado.
 */
import { FakeApi } from './fake-api';
import { PersonService } from '../src/services/person-service';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';
const PERSON_ID = 'p1';

const TAX_FILES_RESPONSE = JSON.stringify({
  data: [
    { id: 'a1', personId: 'p1', tin: 'EKU9003173C9', fileType: 0, validFrom: '2023-05-18T11:43:51', validTo: '2027-05-18T11:43:51', sequence: 1 },
    { id: 'a2', personId: 'p1', tin: 'EKU9003173C9', fileType: 1, validFrom: '2023-05-18T11:43:51', validTo: '2027-05-18T11:43:51', sequence: 1 },
  ],
  succeeded: true,
  message: '',
  details: '',
  httpStatusCode: 200,
});

let api: FakeApi;
let persons: PersonService;

beforeEach(() => {
  api = new FakeApi();
  persons = new PersonService(api.httpClient, API_VERSION);
});

describe('PersonService.getTaxFiles', () => {
  test('hace GET a people/{personId}/tax-files', async () => {
    api.respondWith(TAX_FILES_RESPONSE);

    await persons.getTaxFiles(PERSON_ID);

    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].method).toBe('GET');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/people/${PERSON_ID}/tax-files`);
  });

  test('deserializa la lista de certificados con sus campos y tipos', async () => {
    api.respondWith(TAX_FILES_RESPONSE);

    const response = await persons.getTaxFiles(PERSON_ID);

    expect(response.succeeded).toBe(true);
    expect(response.data).toHaveLength(2);
    expect(response.data[0]).toStrictEqual({
      id: 'a1',
      personId: 'p1',
      tin: 'EKU9003173C9',
      fileType: 0,
      validFrom: '2023-05-18T11:43:51',
      validTo: '2027-05-18T11:43:51',
      sequence: 1,
    });
    expect(response.data[1].fileType).toBe(1);
    expect(response.data[1].id).toBe('a2');
  });
});
