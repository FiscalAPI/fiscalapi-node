import { readFileSync } from 'fs';
import { join } from 'path';
import axios, { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { FiscalapiHttpClient } from '../src/http/fiscalapi-http-client';
import { FiscalapiSettings } from '../src/common/fiscalapi-settings';

const FIXTURES_DIR = join(__dirname, 'fixtures');

/** Petición recibida: método, URL completa y cuerpo JSON ya decodificado (undefined si no lleva). */
export interface RecordedRequest {
  method: string;
  url: string;
  body: Record<string, unknown> | undefined;
}

/** Devuelve el cuerpo crudo de `tests/fixtures/<name>`, tal como lo enviaría el API. */
export function readFixture(name: string): string {
  return readFileSync(join(FIXTURES_DIR, name), 'utf-8');
}

/**
 * API simulada: un adapter de axios que responde con el cuerpo y el status configurados (200 por omisión). El SDK
 * recorre su camino real (servicio -> FiscalapiHttpClient -> axios con su transformResponse) sin red; un status fuera
 * de 2xx se rechaza como lo hacen los adapters de axios (AxiosError con la respuesta), así que pasa por el manejo de
 * errores del SDK.
 */
export class FakeApi {
  readonly requestedUrls: string[] = [];
  readonly requests: RecordedRequest[] = [];
  readonly httpClient: FiscalapiHttpClient;
  private body = '';
  private status = 200;

  constructor() {
    const settings: FiscalapiSettings = {
      apiUrl: 'https://sdk-tests.fiscalapi.invalid',
      apiKey: 'sk_test_sdk',
      tenant: 'tenant-sdk',
    };
    const adapter: AxiosAdapter = (config: InternalAxiosRequestConfig) => this.respond(config);
    this.httpClient = new FiscalapiHttpClient(axios.create({ baseURL: settings.apiUrl, adapter }), settings);
  }

  respondWith(body: string, status = 200): void {
    this.body = body;
    this.status = status;
  }

  private async respond(config: InternalAxiosRequestConfig): Promise<AxiosResponse<string>> {
    this.requestedUrls.push(axios.getUri(config));
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    this.requests.push({ method: (config.method ?? '').toUpperCase(), url: axios.getUri(config), body });
    const response: AxiosResponse<string> = { data: this.body, status: this.status, statusText: '', headers: {}, config };
    if (this.status >= 200 && this.status < 300) {
      return response;
    }
    throw new AxiosError(
      `Request failed with status code ${this.status}`,
      this.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      undefined,
      response,
    );
  }
}
