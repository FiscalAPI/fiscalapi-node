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
    super(httpClient, 'tax-files', apiVersion);
  }


    /**
     * Obtiene el último par de ids de certificados válidos y vigente de una persona. Es decir sus certificados por defecto (ids)
     * 
     * @param personId - Id de la persona propietaria de los certificados
     * @returns Promise que resuelve en una respuesta API con una lista de un par de certificados, pero sin contenido, solo sus Ids
     */
    async getDefaultReferences(personId: string): Promise<ApiResponse<TaxFile[]>> {
      // GET /api/v4/tax-files/{personId}/default-references
      const path = `${personId}/default-references`;
      const endpoint = this.buildEndpoint(path);
      return this.httpClient.getAsync<TaxFile[]>(endpoint);
    }

    /**
    * Obtiene el último par de certificados válidos y vigente de una persona. Es decir sus certificados por defecto
    * 
    * @param personId - Id de la persona dueña de los certificados
    * @returns Promise que resuelve en una respuesta API con una lista de un par de certificados
    */
    public async getDefaultValues(personId: string): Promise<ApiResponse<TaxFile[]>> {
      // GET /api/v4/tax-files/{personId}/default-values
      const path = `${personId}/default-values`;
      const endpoint = this.buildEndpoint(path);
      return this.httpClient.getAsync<TaxFile[]>(endpoint);
    }
}