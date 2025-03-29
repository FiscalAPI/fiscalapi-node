import { TaxFile } from '../models/tax-file';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { ITaxFileService } from '..';

/**
 * Implementación del servicio de archivos fiscales
 */
export class TaxFileService extends BaseFiscalapiService<TaxFile> implements ITaxFileService {
  /**
   * Crea una nueva instancia del servicio de archivos fiscales
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'taxfiles', apiVersion);
  }

  /**
   * @inheritdoc
   */
  async download(id: string): Promise<ApiResponse<FileResponse>> {
    return this.httpClient.getAsync<FileResponse>(this.buildEndpoint(`${id}/download`));
  }
}