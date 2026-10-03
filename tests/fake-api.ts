import { readFileSync } from 'fs';
import { join } from 'path';
import axios, { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { FiscalapiHttpClient } from '../src/http/fiscalapi-http-client';
import { FiscalapiSettings } from '../src/common/fiscalapi-settings';

const FIXTURES_DIR = join(__dirname, 'fixtures');

/** Devuelve el cuerpo crudo de `tests/fixtures/<name>`, tal como lo enviaría el API. */
export function readFixture(name: string): string {
  return readFileSync(join(FIXTURES_DIR, name), 'utf-8');
}

/**
 * API simulada: un adapter de axios que responde con el cuerpo configurado. El SDK recorre su camino
 * real (servicio -> FiscalapiHttpClient -> axios con su transformResponse) sin red.
 */
export class FakeApi {
  readonly requestedUrls: string[] = [];
  readonly httpClient: FiscalapiHttpClient;
  private body = '';

  constructor() {
    const settings: FiscalapiSettings = {
      apiUrl: 'https://sdk-tests.fiscalapi.invalid',
      apiKey: 'sk_test_sdk',
      tenant: 'tenant-sdk',
    };
    const adapter: AxiosAdapter = (config: InternalAxiosRequestConfig) => this.respond(config);
    this.httpClient = new FiscalapiHttpClient(axios.create({ baseURL: settings.apiUrl, adapter }), settings);
  }

  respondWith(body: string): void {
    this.body = body;
  }

  private async respond(config: InternalAxiosRequestConfig): Promise<AxiosResponse<string>> {
    this.requestedUrls.push(axios.getUri(config));
    return { data: this.body, status: 200, statusText: 'OK', headers: {}, config };
  }
}
