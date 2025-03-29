
import { CatalogDto } from '../common/catalog-dto';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ApiResponse } from '../common/api-response';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { ICatalogService } from '..';

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
   * @inheritdoc
   */
  async getCatalog(catalogType: string): Promise<ApiResponse<CatalogDto[]>> {
    return this.httpClient.getAsync<CatalogDto[]>(this.buildEndpoint(catalogType));
  }
}
