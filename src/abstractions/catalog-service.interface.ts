 
import { IFiscalapiService } from './fiscalapi-service.interface';
import { CatalogDto } from '../common/catalog-dto';
import { ApiResponse } from '../common/api-response';

/**
 * Interfaz del servicio de catálogos
 */
export interface ICatalogService extends IFiscalapiService<CatalogDto> {
  /**
   * Obtiene un catálogo por su código
   * @param {string} catalogType - Tipo de catálogo
   * @returns {Promise<ApiResponse<CatalogDto[]>>} Lista de elementos del catálogo
   */
  getCatalog(catalogType: string): Promise<ApiResponse<CatalogDto[]>>;
}