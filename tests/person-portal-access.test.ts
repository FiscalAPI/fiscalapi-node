/**
 * Acceso al portal de una persona (`loginEnabled`) y contraseña opcional. Los mismos escenarios viven en los SDK de
 * .NET, Python, PHP y Java: sin asignar, ninguno de los dos viaja, así que crear una persona sin contraseña no manda
 * `password` y un update que no fija `loginEnabled` no cambia el acceso; `loginEnabled: false` sí viaja.
 */
import { FakeApi } from './fake-api';
import { PersonService } from '../src/services/person-service';
import { Person } from '../src/index';

const API_VERSION = 'v4';
const BASE_URL = 'https://sdk-tests.fiscalapi.invalid';
const PERSON_ID = '4b1c2d3e-0000-4000-8000-000000000002';

const PERSON_RESPONSE = JSON.stringify({
  data: { id: PERSON_ID, legalName: 'Persona de Prueba', email: 'someone@somewhere.com', loginEnabled: true, isOwner: false },
  succeeded: true,
  message: '',
  details: '',
  httpStatusCode: 200,
});

const newPerson = (): Person => ({ legalName: 'Persona de Prueba', email: 'someone@somewhere.com' });

let api: FakeApi;
let persons: PersonService;

beforeEach(() => {
  api = new FakeApi();
  api.respondWith(PERSON_RESPONSE);
  persons = new PersonService(api.httpClient, API_VERSION);
});

const sentBody = (): Record<string, unknown> | undefined => {
  expect(api.requests).toHaveLength(1);
  return api.requests[0].body;
};

describe('crear persona', () => {
  test('sin contraseña no envía password ni loginEnabled', async () => {
    await persons.create(newPerson());

    expect(sentBody()).toStrictEqual({ legalName: 'Persona de Prueba', email: 'someone@somewhere.com' });
  });

  test('con acceso al portal envía password y loginEnabled', async () => {
    const person: Person = { ...newPerson(), password: 'YourStrongPassword123!', loginEnabled: true };

    await persons.create(person);

    expect(sentBody()).toStrictEqual({
      legalName: 'Persona de Prueba',
      email: 'someone@somewhere.com',
      password: 'YourStrongPassword123!',
      loginEnabled: true,
    });
  });
});

describe('actualizar persona', () => {
  test('sin loginEnabled no lo envía', async () => {
    await persons.update({ ...newPerson(), id: PERSON_ID });

    expect(api.requests[0].method).toBe('PUT');
    expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/people/${PERSON_ID}`);
    expect(sentBody()).not.toHaveProperty('loginEnabled');
  });

  test('con loginEnabled en false lo envía como false', async () => {
    await persons.update({ ...newPerson(), id: PERSON_ID, loginEnabled: false });

    expect(sentBody()).toHaveProperty('loginEnabled', false);
  });
});

test('la respuesta trae el acceso efectivo', async () => {
  const response = await persons.getById(PERSON_ID);

  expect(response.data.loginEnabled).toBe(true);
  expect(api.requests[0].url).toBe(`${BASE_URL}/api/v4/people/${PERSON_ID}`);
});
