/**
 * Consistencia entre SDK (SDK-060, DEC-184, DEC-136). Los mismos escenarios viven en los SDK de .NET, Python y Java:
 *  1. las respuestas de error exponen el `traceIdentifier` que manda el API (los textos de los 5xx piden enviarlo a
 *     soporte). Aditivo: `message`, `details` y `httpStatusCode` no cambian (deuda DEC-182/DEC-185 H1);
 *  2. `Person` trae `manifestStatusId` (y `manifestStatus` expandido), que escribe la firma de la carta manifiesto.
 */
import { FakeApi } from './fake-api';
import { ManifestService } from '../src/services/manifest-service';
import { PersonService } from '../src/services/person-service';
import { Person } from '../src/models/person';
import { SignManifestRequest } from '../src/models/manifest';

const API_VERSION = 'v4';
const PERSON_ID = '4b1c2d3e-0000-4000-8000-000000000002';
const TRACE_IDENTIFIER = '5C1E0B7A92D44F3E8A6B1D07F3C29E41';
const UNEXPECTED_ERROR_DETAILS =
  'Ocurrió un error inesperado en el servidor. Escríbenos a soporte@fiscalapi.com con el traceIdentifier de esta respuesta.';
const WRONG_PASSWORD_MESSAGE =
  'La contraseña de la llave privada (.key) es incorrecta o el archivo no es una llave privada.';

const SIGN_REQUEST: SignManifestRequest = {
  base64Cer: 'base64CerHere...',
  base64Key: 'base64KeyHere...',
  password: 'passwordPhraseHere...',
};

let api: FakeApi;

beforeEach(() => {
  api = new FakeApi();
});

describe('1. traceIdentifier en las respuestas de error (SDK-060)', () => {
  test('un 500 trae el traceIdentifier; message y details como antes', async () => {
    const body = {
      data: null,
      succeeded: false,
      message: 'Something went wrong on our end.',
      details: UNEXPECTED_ERROR_DETAILS,
      httpStatusCode: 500,
      traceIdentifier: TRACE_IDENTIFIER,
    };
    api.respondWith(JSON.stringify(body), 500);

    const response = await new ManifestService(api.httpClient, API_VERSION).sign(SIGN_REQUEST);

    expect(response.succeeded).toBe(false);
    expect(response.httpStatusCode).toBe(500);
    expect(response.traceIdentifier).toBe(TRACE_IDENTIFIER);
    expect(response.message).toBe('Request failed with status code 500');
    expect(JSON.parse(response.details)).toEqual(body);
  });

  test('un 404 trae el traceIdentifier', async () => {
    api.respondWith(
      JSON.stringify({
        data: null,
        succeeded: false,
        message: "Sorry, it's not me, it's you.",
        details: 'No existe un usuario con RFC EKU9003173C9 en el tenant actual.',
        httpStatusCode: 404,
        traceIdentifier: TRACE_IDENTIFIER,
      }),
      404,
    );

    const response = await new ManifestService(api.httpClient, API_VERSION).sign(SIGN_REQUEST);

    expect(response.httpStatusCode).toBe(404);
    expect(response.traceIdentifier).toBe(TRACE_IDENTIFIER);
  });

  test('un 400 de validación trae el traceIdentifier; message y details como antes', async () => {
    const failures = [{ propertyName: 'Password', errorMessage: WRONG_PASSWORD_MESSAGE, attemptedValue: null }];
    api.respondWith(
      JSON.stringify({
        data: failures,
        succeeded: false,
        message: "Sorry, it's not me, it's you.",
        details: 'One or more validation failures have occurred.',
        httpStatusCode: 400,
        traceIdentifier: TRACE_IDENTIFIER,
      }),
      400,
    );

    const response = await new ManifestService(api.httpClient, API_VERSION).sign(SIGN_REQUEST);

    expect(response.httpStatusCode).toBe(400);
    expect(response.traceIdentifier).toBe(TRACE_IDENTIFIER);
    expect(response.message).toBe(WRONG_PASSWORD_MESSAGE);
    expect(JSON.parse(response.details)).toEqual(failures);
  });

  test('un error sin traceIdentifier lo deja undefined', async () => {
    api.respondWith(
      JSON.stringify({ data: null, succeeded: false, message: 'Too Many Requests', details: 'x', httpStatusCode: 429 }),
      429,
    );

    const response = await new ManifestService(api.httpClient, API_VERSION).sign(SIGN_REQUEST);

    expect(response.httpStatusCode).toBe(429);
    expect(response.traceIdentifier).toBeUndefined();
  });
});

describe('2. persona: manifestStatusId (SDK-060)', () => {
  test('la respuesta trae manifestStatusId y manifestStatus', async () => {
    api.respondWith(
      JSON.stringify({
        data: {
          id: PERSON_ID,
          tin: 'EKU9003173C9',
          manifestStatusId: 'Signed',
          manifestStatus: { id: 'Signed', description: 'Firmado' },
        },
        succeeded: true,
        message: '',
        details: '',
        httpStatusCode: 200,
      }),
    );

    const response = await new PersonService(api.httpClient, API_VERSION).getById(PERSON_ID);
    const person: Person = response.data;

    expect(response.succeeded).toBe(true);
    expect(person.manifestStatusId).toBe('Signed');
    expect(person.manifestStatus?.id).toBe('Signed');
    expect(person.manifestStatus?.description).toBe('Firmado');
  });
});
