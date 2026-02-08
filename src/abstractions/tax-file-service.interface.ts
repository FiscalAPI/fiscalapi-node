import { IFiscalapiService } from './fiscalapi-service.interface';
import { TaxFile } from '../models/tax-file';
import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';

/**
 * Interfaz del servicio de archivos fiscales
 */
export interface ITaxFileService extends IFiscalapiService<TaxFile> {


  /**
     * Obtiene el último par de ids de certificados válidos y vigente de una persona. Es decir sus certificados por defecto (ids)
     * 
     * @param personId - Id de la persona propietaria de los certificados
     * @returns Promise que resuelve en una respuesta API con una lista de un par de certificados, pero sin contenido, solo sus Ids
     */
  getDefaultReferences(personId: string): Promise<ApiResponse<TaxFile[]>>;

  /**
    * Obtiene el último par de certificados válidos y vigente de una persona. Es decir sus certificados por defecto
    * 
    * @param personId - Id de la persona dueña de los certificados
    * @returns Promise que resuelve en una respuesta API con una lista de un par de certificados
    */
  getDefaultValues(personId: string): Promise<ApiResponse<TaxFile[]>>;
}

