 
import { ApiKey } from '../models/api-key';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IApiKeyService } from '..';

/**
 * Implementación del servicio de claves de API
 */
export class ApiKeyService extends BaseFiscalapiService<ApiKey> implements IApiKeyService {
  /**
   * Crea una nueva instancia del servicio de claves de API
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'apikeys', apiVersion);
  }
}