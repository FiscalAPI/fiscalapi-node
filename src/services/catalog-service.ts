import { CatalogDto } from '../common/catalog-dto';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ApiResponse } from '../common/api-response';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { ICatalogService, PagedList } from '..';

/**
 * Implementación del servicio de catálogos
 */
export class CatalogService extends BaseFiscalapiService<CatalogDto> implements ICatalogService {
  /**
   * Crea una nueva instancia del servicio de catálogos
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'catalogs', apiVersion);
  }



    /**
    * Recupera un registro de un catálogo por catalogName y id.
    * 
    * @param catalogName - Nombre del catálogo
    * @param id - Id del registro en el catalogName
    * @returns Promise que resuelve en una respuesta API con CatalogDto
    */
    public async getRecordById(catalogName: string, id: string): Promise<ApiResponse<CatalogDto>> {
      const path = `${catalogName}/key/${id}`;
      const endpoint = this.buildEndpoint(path);
      // api/v4/catalogs/<catalogName>/key/<id>
      return this.httpClient.getAsync<CatalogDto>(endpoint);
    }

    /**
    * Busca en un catálogo.
    * 
    * @param catalogName - Catalog name. Must be a catalog retrieved from getList()
    * @param searchText - Criterio de búsqueda. Debe tener 4 caracteres de longitud como mínimo.
    * @param pageNumber - Numero de pagina a recuperar (default: 1)
    * @param pageSize - Tamaño de la página entre 1 y 100 registros por página (default: 50)
    * @returns Promise que resuelve en una respuesta API con lista paginada de CatalogDto
    */
    public async searchCatalog(
      catalogName: string, 
      searchText: string,
      pageNumber: number = 1, 
      pageSize: number = 50
    ): Promise<ApiResponse<PagedList<CatalogDto>>> {
      const path = `${catalogName}/${searchText}`;
      const queryParams = {
          pageNumber: pageNumber.toString(),
          pageSize: pageSize.toString()
      };
      const endpoint = this.buildEndpoint(path, queryParams);
      const response = await this.httpClient.getAsync<PagedList<CatalogDto>>(endpoint);
      return response;
    }

  
}
