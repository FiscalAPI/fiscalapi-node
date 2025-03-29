 
import { IFiscalapiService } from './fiscalapi-service.interface';
import { TaxFile } from '../models/tax-file';
import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';

/**
 * Interfaz del servicio de archivos fiscales
 */
export interface ITaxFileService extends IFiscalapiService<TaxFile> {
  /**
   * Descarga un archivo fiscal
   * @param {string} id - ID del archivo fiscal
   * @returns {Promise<ApiResponse<FileResponse>>} Respuesta con el archivo
   */
  download(id: string): Promise<ApiResponse<FileResponse>>;
}

