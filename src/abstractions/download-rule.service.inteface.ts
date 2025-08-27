import { IFiscalapiService } from './fiscalapi-service.interface';
import { DownloadRequest, DownloadRule } from '../models/download';
import { ApiResponse } from '../common/api-response';

/**
 * Interfaz del servicio de reglas de descarga masiva
 */
export interface IDownloadRuleService extends IFiscalapiService<DownloadRule> {
  /**
   * GET /api/v4/download-rules/test
   * Crea una regla de descarga masiva de prueba
   * 
   * @returns Regla de descarga masiva de prueba
   */
    createTestRule(): Promise<ApiResponse<DownloadRequest>>;
}

