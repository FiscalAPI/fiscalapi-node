import { DownloadRequest, DownloadRule } from '../models/download';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IDownloadRuleService } from '../abstractions/download-rule.service.inteface';
import { ApiResponse } from '../common/api-response';

/**
 * Implementación del servicio de reglas de descarga masiva
 */
export class DownloadRuleService extends BaseFiscalapiService<DownloadRule> implements IDownloadRuleService {
  /**
* Crea una nueva instancia del servicio de reglas de descarga masiva
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'download-rules', apiVersion);
  }

  /**
   * Crea una regla y una solicitud de descarga masiva de prueba.
   * 
   * @returns solicitud de descarga masiva de prueba
   */   
  createTestRule(): Promise<ApiResponse<DownloadRequest>> {
    // GET /api/v4/download-rules/test
    var path = "test";
    var endpoint = this.buildEndpoint(path);
    return this.httpClient.postAsync<DownloadRequest>(endpoint, {});
  }
}