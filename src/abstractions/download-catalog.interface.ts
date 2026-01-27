import { ApiResponse } from "../common/api-response";
import { CatalogDto } from "../common/catalog-dto";

/**
 * Interfaz del servicio de catálogos de descarga masiva
 */
export interface IDownloadCatalogService  {
    /**
     * GET /api/v4/download-catalogs
     * Recupera todos los nombres de los catálogos de descarga masiva disponibles para listarlos individualmente por nombre.
     * 
     * @returns Lista de nombres de catálogos disponibles
     */
    getList(): Promise<ApiResponse<string[]>>;
  
    /**
     * GET /api/v4/download-catalogs/{catalogName}
     * Lista todos los registros de un catálogo pasando el nombre del catálogo
     * 
     * @param catalogName - Nombre del catálogo
     * @returns Lista de registros del catálogo
     */
    listCatalog(catalogName: string): Promise<ApiResponse<CatalogDto[]>>;
  }