import { ApiResponse } from '../common/api-response';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { IManifestService } from '../abstractions/manifest-service.interface';
import { SignManifestRequest, SignManifestResponse } from '../models/manifest';

/**
 * Implementación del servicio de manifiestos
 */
export class ManifestService implements IManifestService {
  /** Cliente HTTP */
  private readonly httpClient: IFiscalapiHttpClient;

  /** Ruta base del recurso */
  private readonly baseEndpoint: string;

  /**
   * Crea una nueva instancia del servicio de manifiestos
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string = 'v4') {
    if (!httpClient) throw new Error('httpClient no puede ser nulo o indefinido');
    if (!apiVersion) throw new Error('apiVersion no puede ser nulo o indefinido');

    this.httpClient = httpClient;
    this.baseEndpoint = `api/${apiVersion}/manifests`;
  }

  /**
   * @inheritdoc
   */
  async sign(request: SignManifestRequest): Promise<ApiResponse<SignManifestResponse>> {
    if (!request) {
      throw new Error('request cannot be null');
    }

    // POST /api/v4/manifests
    return this.httpClient.postAsync<SignManifestResponse, SignManifestRequest>(this.baseEndpoint, request);
  }
}
