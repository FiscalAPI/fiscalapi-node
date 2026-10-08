/**
 * Cambios de código del SDK en el ciclo de deuda técnica 2 (Fase III, C22). Los mismos escenarios viven en los SDK de
 * .NET, Python, PHP y Java (DEC-136), cuando el cambio aplica a cada uno:
 *  1. persona: `validTo` de solo lectura y `committedBalance` heredado; `capitalRegime`, `stripeCustomerId` y
 *     `subscriptionStatus` fuera del tipo `Person` (SDK-043, SDK-044);
 *  2. certificados: `tin` opcional al subir (SDK-045, SDK-046) y `fileType` 2 y 3 de la FIEL (SDK-058);
 *  3. certificados sin `update()`: el API retiró PUT tax-files (SDK-051); los servicios que sí actualizan lo conservan.
 *
 * Las líneas con `@ts-expect-error` son pruebas de tipos: ts-jest compila el archivo y falla si el miembro vuelve a
 * existir.
 */
import { FakeApi, readFixture } from './fake-api';
import { PersonService } from '../src/services/person-service';
import { TaxFileService } from '../src/services/tax-file-service';
import { ITaxFileService } from '../src/abstractions/tax-file-service.interface';
import { Person } from '../src/models/person';
import { TaxFile } from '../src/models/tax-file';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';
const PERSON_ID = '4b1c2d3e-0000-4000-8000-000000000002';
const TAX_FILE_ID = '7a1b2c3d-0000-4000-8000-0000000000f1';

const TAX_FILE_RESPONSE = JSON.stringify({
  data: { id: TAX_FILE_ID, personId: PERSON_ID, tin: 'EKU9003173C9', fileType: 2, sequence: 1 },
  succeeded: true,
  message: '',
  details: '',
  httpStatusCode: 200,
});
const DELETED_RESPONSE = JSON.stringify({ data: true, succeeded: true, message: '', details: '', httpStatusCode: 200 });

let api: FakeApi;

beforeEach(() => {
  api = new FakeApi();
});

describe('1. persona (SDK-043, SDK-044)', () => {
  test('la respuesta trae validTo y committedBalance; capitalRegime y los campos de Stripe no están en el tipo', async () => {
    api.respondWith(readFixture('person-valid-to.json'));

    const response = await new PersonService(api.httpClient, API_VERSION).getById(PERSON_ID);
    const person: Person = response.data;

    expect(response.succeeded).toBe(true);
    expect(person.validTo).toBe('2025-07-15T10:30:00.000');
    expect(person.committedBalance).toBe(0);
    expect(person.availableBalance).toBe(100);
    // @ts-expect-error capitalRegime salió de Person (SDK-044)
    void person.capitalRegime;
    // @ts-expect-error stripeCustomerId salió de Person (SDK-043)
    void person.stripeCustomerId;
    // @ts-expect-error subscriptionStatus salió de Person (SDK-043)
    void person.subscriptionStatus;
  });

  test('crear una persona no envía validTo ni los campos retirados', async () => {
    api.respondWith(readFixture('person-valid-to.json'));
    const person: Person = {
      legalName: 'ESCUELA KEMPER URGATE',
      email: 'someone@example.com',
      password: 'UserPass123!',
      tin: 'EKU9003173C9',
    };

    await new PersonService(api.httpClient, API_VERSION).create(person);

    expect(api.requests).toHaveLength(1);
    const [request] = api.requests;
    expect(request.method).toBe('POST');
    expect(request.url).toBe(`${BASE_URL}/api/v4/people`);
    expect(request.body).toHaveProperty('legalName', 'ESCUELA KEMPER URGATE');
    for (const key of ['validTo', 'capitalRegime', 'stripeCustomerId', 'subscriptionStatus']) {
      expect(request.body).not.toHaveProperty(key);
    }
  });
});

describe('2. certificados: tin opcional (SDK-045, SDK-046) y fileType de la FIEL (SDK-058)', () => {
  test.each([2, 3])('subir sin tin con fileType %i lo envía como número y sin tin', async (fileType: number) => {
    api.respondWith(TAX_FILE_RESPONSE);
    const taxFile: TaxFile = {
      personId: PERSON_ID,
      base64File: 'MIIFsDCCA5igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDM0MTYwDQYJKoZIhvcNAQELBQAw',
      fileType,
      password: '12345678a',
    };

    const response = await new TaxFileService(api.httpClient, API_VERSION).create(taxFile);

    expect(response.succeeded).toBe(true);
    expect(response.data.tin).toBe('EKU9003173C9');
    expect(api.requests).toHaveLength(1);
    const [request] = api.requests;
    expect(request.method).toBe('POST');
    expect(request.url).toBe(`${BASE_URL}/api/v4/tax-files`);
    expect(request.body).toEqual({
      personId: PERSON_ID,
      base64File: taxFile.base64File,
      fileType,
      password: '12345678a',
    });
  });
});

describe('3. certificados sin update() (SDK-051)', () => {
  test('el servicio de certificados no tiene update()', () => {
    const service: ITaxFileService = new TaxFileService(api.httpClient, API_VERSION);

    // @ts-expect-error ITaxFileService no tiene update() (SDK-051)
    void service.update;
    expect('update' in service).toBe(false);
  });

  test('los servicios que sí actualizan conservan update(): personas envía PUT', async () => {
    api.respondWith(readFixture('person-valid-to.json'));

    const response = await new PersonService(api.httpClient, API_VERSION).update({ id: PERSON_ID, legalName: 'ESCUELA KEMPER URGATE' });

    expect(response.succeeded).toBe(true);
    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].method).toBe('PUT');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/people/${PERSON_ID}`);
    expect(api.requests[0].body).toHaveProperty('id', PERSON_ID);
  });

  test('delete() envía DELETE al certificado', async () => {
    api.respondWith(DELETED_RESPONSE);

    const response = await new TaxFileService(api.httpClient, API_VERSION).delete(TAX_FILE_ID);

    expect(response.succeeded).toBe(true);
    expect(response.data).toBe(true);
    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].method).toBe('DELETE');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/tax-files/${TAX_FILE_ID}`);
  });
});
