/**
 * Webhook.verify: la firma Standard Webhooks (HMAC-SHA256 sobre webhook-id.webhook-timestamp.cuerpo) y la tolerancia del
 * timestamp. Los mismos escenarios viven en los SDK de .NET, Python, PHP y Java. El reloj se fija con `Date.now`, así el
 * vector oficial (de 2021) verifica sin depender de la hora real.
 */
import type { IncomingHttpHeaders } from 'http';
import { Webhook, WebhookVerificationError } from '../src/index';
import type { WebhookEvent, WebhookHeaders } from '../src/index';
import { generateSecret, sign } from './back-webhook-signer';

// El vector publicado por Standard Webhooks (https://github.com/standard-webhooks/standard-webhooks): no es un secreto.
const OFFICIAL_SECRET = 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw';
const OFFICIAL_ID = 'msg_p5jXN8AQM9LWM0D4loKWxJek';
const OFFICIAL_TIMESTAMP = 1614265330;
const OFFICIAL_BODY = '{"test": 2432232314}';
const OFFICIAL_SIGNATURE = 'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=';

const DEFAULT_TOLERANCE = Webhook.DEFAULT_TOLERANCE_SECONDS;

function officialHeaders(overrides: { id?: string; timestamp?: string; signature?: string } = {}): Record<string, string> {
  return {
    'webhook-id': overrides.id ?? OFFICIAL_ID,
    'webhook-timestamp': overrides.timestamp ?? String(OFFICIAL_TIMESTAMP),
    'webhook-signature': overrides.signature ?? OFFICIAL_SIGNATURE,
  };
}

function setClock(unixSeconds: number): void {
  jest.spyOn(Date, 'now').mockReturnValue(unixSeconds * 1000);
}

function verifyAt(
  unixSeconds: number,
  headers: WebhookHeaders,
  body: string | Uint8Array,
  secrets: string | readonly string[] = OFFICIAL_SECRET,
  toleranceSeconds?: number,
): WebhookEvent {
  setClock(unixSeconds);
  return typeof secrets === 'string'
    ? Webhook.verify(headers, body, secrets, toleranceSeconds)
    : Webhook.verify(headers, body, secrets, toleranceSeconds);
}

/** Ejecuta `action` y devuelve el error lanzado; falla si no lanza. */
function errorOf(action: () => unknown): Error {
  try {
    action();
  } catch (error) {
    return error as Error;
  }
  throw new Error('Se esperaba un error y no se lanzó ninguno.');
}

function verificationErrorOf(action: () => unknown): WebhookVerificationError {
  const error = errorOf(action);
  expect(error).toBeInstanceOf(WebhookVerificationError);
  return error as WebhookVerificationError;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Webhook.verify: firma', () => {
  test('el vector oficial verifica', () => {
    const event = verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY);

    expect(event).toEqual({ test: 2432232314 });
  });

  test('el vector oficial verifica con el cuerpo en bytes (express.raw entrega un Buffer)', () => {
    const event = verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), Buffer.from(OFFICIAL_BODY, 'utf8'));

    expect(event).toEqual({ test: 2432232314 });
  });

  test('una firma alterada se rechaza', () => {
    const headers = officialHeaders({ signature: 'v1,g0hM9SsF+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=' });

    const error = verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, headers, OFFICIAL_BODY));
    expect(error.message).toContain('Ninguna firma');
  });

  test('un cuerpo alterado se rechaza', () => {
    verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), '{"test": 2432232315}'));
  });

  test('un cuerpo reserializado después de firmarse se rechaza', () => {
    // Mismo JSON sin el espacio: verificar exige el cuerpo crudo, no uno reserializado.
    verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), '{"test":2432232314}'));
  });

  test('un id alterado se rechaza', () => {
    verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ id: 'msg_otro' }), OFFICIAL_BODY));
  });

  test.each([
    'v1a,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=',
    'v2,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=',
    'g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=',
    'v1,',
    'v1,!!!',
    'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE',
  ])('un header de firma sin una firma v1 válida se rechaza: %s', (signature) => {
    const error = verificationErrorOf(() =>
      verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature }), OFFICIAL_BODY),
    );
    expect(error.message).toContain('Ninguna firma');
  });

  test('cualquier firma v1 válida entre varias verifica', () => {
    const signature = `v1,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= v1a,ignorada malformada ${OFFICIAL_SIGNATURE}`;

    expect(verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature }), OFFICIAL_BODY)).toBeDefined();
  });

  test('un secreto sin el prefijo whsec_ verifica', () => {
    const secret = OFFICIAL_SECRET.substring('whsec_'.length);

    expect(verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY, secret)).toBeDefined();
  });

  test('cualquiera de varios secretos verifica durante una rotación', () => {
    const otherSecret = generateSecret();

    expect(verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY, [otherSecret, OFFICIAL_SECRET])).toBeDefined();
    verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY, [otherSecret]));
  });
});

describe('Webhook.verify: timestamp', () => {
  test('un timestamp más viejo que la tolerancia se rechaza y el límite exacto se acepta', () => {
    expect(verifyAt(OFFICIAL_TIMESTAMP + DEFAULT_TOLERANCE, officialHeaders(), OFFICIAL_BODY)).toBeDefined();

    const error = verificationErrorOf(() =>
      verifyAt(OFFICIAL_TIMESTAMP + DEFAULT_TOLERANCE + 1, officialHeaders(), OFFICIAL_BODY),
    );
    expect(error.message).toContain('webhook-timestamp');
    expect(error.message).toContain('difiere');
  });

  test('un timestamp más adelantado que la tolerancia se rechaza y el límite exacto se acepta', () => {
    expect(verifyAt(OFFICIAL_TIMESTAMP - DEFAULT_TOLERANCE, officialHeaders(), OFFICIAL_BODY)).toBeDefined();

    const error = verificationErrorOf(() =>
      verifyAt(OFFICIAL_TIMESTAMP - DEFAULT_TOLERANCE - 1, officialHeaders(), OFFICIAL_BODY),
    );
    expect(error.message).toContain('difiere');
  });

  test('la tolerancia por omisión es de 5 minutos', () => {
    expect(Webhook.DEFAULT_TOLERANCE_SECONDS).toBe(300);
  });

  test('una tolerancia personalizada reemplaza la de omisión', () => {
    expect(verifyAt(OFFICIAL_TIMESTAMP + 30, officialHeaders(), OFFICIAL_BODY, OFFICIAL_SECRET, 30)).toBeDefined();

    verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP + 31, officialHeaders(), OFFICIAL_BODY, OFFICIAL_SECRET, 30));
  });

  test('una tolerancia negativa, infinita o que no es un número es un error de configuración', () => {
    expect(errorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY, OFFICIAL_SECRET, -1))).toBeInstanceOf(RangeError);
    expect(errorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY, OFFICIAL_SECRET, Infinity))).toBeInstanceOf(RangeError);
    expect(errorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY, OFFICIAL_SECRET, NaN))).toBeInstanceOf(TypeError);
    expect(
      errorOf(() => Webhook.verify(officialHeaders(), OFFICIAL_BODY, OFFICIAL_SECRET, '300' as unknown as number)),
    ).toBeInstanceOf(TypeError);
  });

  test.each(['1614265330.5', '-1614265330', ' 1614265330', '1614265330000000000000', 'abc', '9223372036854775808'])(
    'un timestamp que no es un número de segundos Unix se rechaza: "%s"',
    (timestamp) => {
      const error = verificationErrorOf(() =>
        verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ timestamp }), OFFICIAL_BODY),
      );
      expect(error.message).toContain('segundos Unix');
    },
  );

  test('el mayor timestamp Unix de 64 bits se rechaza por la tolerancia, sin desbordarse', () => {
    const error = verificationErrorOf(() =>
      verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ timestamp: '9223372036854775807' }), OFFICIAL_BODY),
    );
    expect(error.message).toContain('difiere');
  });

  test('un timestamp alterado dentro de la tolerancia se rechaza porque va firmado', () => {
    const altered = OFFICIAL_TIMESTAMP + 1;

    const error = verificationErrorOf(() =>
      verifyAt(altered, officialHeaders({ timestamp: String(altered) }), OFFICIAL_BODY),
    );
    expect(error.message).toContain('Ninguna firma');
  });

  test('el timestamp se firma tal como llegó: con ceros a la izquierda verifica solo si así se firmó', () => {
    const timestamp = '0' + OFFICIAL_TIMESTAMP;
    const signature = sign(OFFICIAL_ID, timestamp, OFFICIAL_BODY, OFFICIAL_SECRET);

    expect(verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ timestamp, signature }), OFFICIAL_BODY)).toBeDefined();
    verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ timestamp }), OFFICIAL_BODY));
  });
});

describe('Webhook.verify: cuerpo', () => {
  test('un cuerpo con un sustituto suelto se rechaza aunque se firme sobre su carácter de reemplazo', () => {
    // Un sustituto suelto no tiene UTF-8: un codificador tolerante (Buffer, TextEncoder) lo cambia por U+FFFD y
    // verificaría otros bytes.
    const body = '{"test": "\uD800"}';
    const signature = sign(OFFICIAL_ID, OFFICIAL_TIMESTAMP, body, OFFICIAL_SECRET);

    const error = verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature }), body));
    expect(error.message).toContain('UTF-8');
  });

  test('un sustituto bajo suelto también se rechaza y un par válido (emoji) verifica', () => {
    const lone = '{"test": "\uDC00"}';
    const pair = '{"test": "😀"}';

    verificationErrorOf(() =>
      verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature: sign(OFFICIAL_ID, OFFICIAL_TIMESTAMP, lone, OFFICIAL_SECRET) }), lone),
    );
    expect(
      verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature: sign(OFFICIAL_ID, OFFICIAL_TIMESTAMP, pair, OFFICIAL_SECRET) }), pair),
    ).toEqual({ test: '😀' });
  });

  test('un cuerpo en bytes que no es UTF-8 válido se rechaza aunque esos bytes vayan firmados', () => {
    const body = Buffer.concat([Buffer.from('{"test": "', 'utf8'), Buffer.from([0xff]), Buffer.from('"}', 'utf8')]);
    const signature = sign(OFFICIAL_ID, OFFICIAL_TIMESTAMP, body, OFFICIAL_SECRET);

    const error = verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature }), body));
    expect(error.message).toContain('UTF-8');
  });

  test('un cuerpo firmado que no es JSON se rechaza con la causa original', () => {
    const body = 'no es json';
    const signature = sign(OFFICIAL_ID, OFFICIAL_TIMESTAMP, body, OFFICIAL_SECRET);

    const error = verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature }), body));
    expect(error.cause).toBeInstanceOf(SyntaxError);
  });

  test.each(['{"id":"evt_1"} {"id":"evt_2"}', 'null', '[]', '2', '"evento"'])(
    'un cuerpo firmado que no es un solo objeto JSON se rechaza: %s',
    (body) => {
      const signature = sign(OFFICIAL_ID, OFFICIAL_TIMESTAMP, body, OFFICIAL_SECRET);

      verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders({ signature }), body));
    },
  );
});

describe('Webhook.verify: headers', () => {
  test.each(['webhook-id', 'webhook-timestamp', 'webhook-signature'])('falta el header %s y el error lo nombra', (missing) => {
    const headers = officialHeaders();
    delete headers[missing];

    const error = verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, headers, OFFICIAL_BODY));
    expect(error.message).toBe(`Falta el header ${missing}.`);
  });

  test.each(['webhook-id', 'webhook-timestamp', 'webhook-signature'])('el header %s vacío cuenta como faltante', (empty) => {
    const headers: Record<string, string | string[]> = { ...officialHeaders(), [empty]: '' };
    const asArray: Record<string, string | string[]> = { ...officialHeaders(), [empty]: [] };

    expect(verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, headers, OFFICIAL_BODY)).message).toBe(`Falta el header ${empty}.`);
    expect(verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, asArray, OFFICIAL_BODY)).message).toBe(`Falta el header ${empty}.`);
  });

  test('los nombres de los headers no distinguen mayúsculas', () => {
    const headers = {
      'Webhook-Id': OFFICIAL_ID,
      'WEBHOOK-TIMESTAMP': String(OFFICIAL_TIMESTAMP),
      'Webhook-Signature': OFFICIAL_SIGNATURE,
    };

    expect(verifyAt(OFFICIAL_TIMESTAMP, headers, OFFICIAL_BODY)).toBeDefined();
  });

  test('acepta el objeto req.headers de Node/Express, con valores string o string[]', () => {
    const headers: IncomingHttpHeaders = {
      'content-type': 'application/json',
      'webhook-id': OFFICIAL_ID,
      'webhook-timestamp': String(OFFICIAL_TIMESTAMP),
      'webhook-signature': OFFICIAL_SIGNATURE,
      'set-cookie': ['a=1'],
    };
    const distinct: Record<string, string[]> = {
      'webhook-id': [OFFICIAL_ID],
      'webhook-timestamp': [String(OFFICIAL_TIMESTAMP)],
      'webhook-signature': [OFFICIAL_SIGNATURE],
    };

    expect(verifyAt(OFFICIAL_TIMESTAMP, headers, OFFICIAL_BODY)).toBeDefined();
    expect(verifyAt(OFFICIAL_TIMESTAMP, distinct, OFFICIAL_BODY)).toBeDefined();
  });

  test('acepta un Headers de fetch', () => {
    const headers = new Headers(officialHeaders());

    expect(verifyAt(OFFICIAL_TIMESTAMP, headers, OFFICIAL_BODY)).toBeDefined();
    const missing = new Headers({ 'webhook-id': OFFICIAL_ID, 'webhook-timestamp': String(OFFICIAL_TIMESTAMP) });
    expect(verificationErrorOf(() => verifyAt(OFFICIAL_TIMESTAMP, missing, OFFICIAL_BODY)).message).toBe(
      'Falta el header webhook-signature.',
    );
  });
});

describe('Webhook.verify: configuración del receptor', () => {
  test.each([
    '',
    'whsec_',
    'whsec_%%no-es-base64%%',
    'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw!!',
    'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaS',
    'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw\n',
    'whsec_MfKQ9r8GKYqrTwjU PD8ILPZIo2LaLaSw',
  ])(
    'un secreto mal formado es un error de configuración: "%s"',
    (secret) => {
      expect(errorOf(() => verifyAt(OFFICIAL_TIMESTAMP, officialHeaders(), OFFICIAL_BODY, secret))).toBeInstanceOf(TypeError);
    },
  );

  test('un secreto mal formado en una lista indica su posición sin su valor', () => {
    const malformed = 'whsec_%%no-es-base64%%';

    const inList = errorOf(() => Webhook.verify(officialHeaders(), OFFICIAL_BODY, [OFFICIAL_SECRET, malformed]));
    expect(inList).toBeInstanceOf(TypeError);
    expect(inList.message).toContain('posición 1');
    expect(inList.message).not.toContain('no-es-base64');

    const nullInList = errorOf(() =>
      Webhook.verify(officialHeaders(), OFFICIAL_BODY, [OFFICIAL_SECRET, null as unknown as string]),
    );
    expect(nullInList).toBeInstanceOf(TypeError);
    expect(nullInList.message).toContain('posición 1');

    const single = errorOf(() => Webhook.verify(officialHeaders(), OFFICIAL_BODY, malformed));
    expect(single).toBeInstanceOf(TypeError);
    expect(single.message).not.toContain('no-es-base64');
    expect(single.message).not.toContain('posición');
  });

  test('los argumentos faltantes o de otro tipo son un error de configuración', () => {
    const missing = [
      () => Webhook.verify(null as unknown as WebhookHeaders, OFFICIAL_BODY, OFFICIAL_SECRET),
      () => Webhook.verify(undefined as unknown as WebhookHeaders, OFFICIAL_BODY, OFFICIAL_SECRET),
      () => Webhook.verify(officialHeaders(), null as unknown as string, OFFICIAL_SECRET),
      () => Webhook.verify(officialHeaders(), 42 as unknown as string, OFFICIAL_SECRET),
      () => Webhook.verify(officialHeaders(), OFFICIAL_BODY, null as unknown as string),
      () => Webhook.verify(officialHeaders(), OFFICIAL_BODY, undefined as unknown as string),
      () => Webhook.verify(officialHeaders(), OFFICIAL_BODY, []),
    ];

    for (const action of missing) {
      expect(errorOf(action)).toBeInstanceOf(TypeError);
    }
  });

  test('un error de configuración se informa antes que una entrega no auténtica', () => {
    expect(errorOf(() => Webhook.verify({}, OFFICIAL_BODY, 'whsec_%%'))).toBeInstanceOf(TypeError);
  });
});

describe('Webhook.verify: reloj real', () => {
  test('sin fijar el reloj verifica contra la hora actual', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const headers = officialHeaders({
      timestamp: String(timestamp),
      signature: sign(OFFICIAL_ID, timestamp, OFFICIAL_BODY, OFFICIAL_SECRET),
    });

    expect(Webhook.verify(headers, OFFICIAL_BODY, OFFICIAL_SECRET)).toBeDefined();
    expect(Webhook.verify(headers, OFFICIAL_BODY, [OFFICIAL_SECRET])).toBeDefined();
    verificationErrorOf(() => Webhook.verify(officialHeaders(), OFFICIAL_BODY, OFFICIAL_SECRET));
  });
});
