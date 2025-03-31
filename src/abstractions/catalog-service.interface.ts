 
import { IFiscalapiService } from './fiscalapi-service.interface';
import { CatalogDto } from '../common/catalog-dto';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';

/**
 * Interfaz del servicio de catálogos
 */
export interface ICatalogService extends IFiscalapiService<CatalogDto> {
 

  /**
   * /api/v4/catalogs/<catalogName>/key/<id>
   * Recupera un registro específico por catalogName e id
   * 
   * @param catalogName - Nombre del catálogo
   * @param id - Identificador del registro
   */
  getRecordById(catalogName: string, id: string): Promise<ApiResponse<CatalogDto>>;

  /**
   * GET /api/v4/catalogs/{catalogName}/{searchText}
   * Busca registros en un catálogo específico
   * 
   * @param catalogName - Nombre del catálogo
   * @param searchText - Texto de búsqueda
   * @param pageNumber - Número de página (opcional, default: 1)
   * @param pageSize - Tamaño de página (opcional, default: 50)
   */
  searchCatalog(
      catalogName: string, 
      searchText: string, 
      pageNumber?: number, 
      pageSize?: number
  ): Promise<ApiResponse<PagedList<CatalogDto>>>;

  
}