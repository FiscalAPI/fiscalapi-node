import { ApiResponse } from '../common/api-response';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { IMeService } from '../abstractions/me-service.interface';
import { MeInfo } from '../models/me';

/**
 * Implementación del servicio de la persona de la credencial
 */
export class MeService implements IMeService {
  /** Cliente HTTP */
  private readonly httpClient: IFiscalapiHttpClient;

  /** Ruta del recurso */
  private readonly endpoint: string;

  /**
   * Crea una nueva instancia del servicio de la persona de la credencial
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string = 'v4') {
    if (!httpClient) throw new Error('httpClient no puede ser nulo o indefinido');
    if (!apiVersion) throw new Error('apiVersion no puede ser nulo o indefinido');

    this.httpClient = httpClient;
    this.endpoint = `api/${apiVersion}/me`;
  }

  /**
   * @inheritdoc
   */
  async get(): Promise<ApiResponse<MeInfo>> {
    return this.httpClient.getAsync<MeInfo>(this.endpoint);
  }
}
