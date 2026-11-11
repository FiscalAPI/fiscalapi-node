import { Product, ProductListFilters } from '../models/product';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IProductService } from '../abstractions/product-service.interface';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { isListFilters, toQueryString } from '../utils/list-query';

/**
 * Implementación del servicio de productos
 */
export class ProductService extends BaseFiscalapiService<Product> implements IProductService {
  /**
   * Crea una nueva instancia del servicio de productos
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'products', apiVersion);
  }

  /**
   * @inheritdoc
   */
  getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<Product>>>;
  /**
   * @inheritdoc
   */
  getList(filters?: ProductListFilters): Promise<ApiResponse<PagedList<Product>>>;
  async getList(
    pageNumberOrFilters?: number | ProductListFilters,
    pageSize?: number,
  ): Promise<ApiResponse<PagedList<Product>>> {
    if (isListFilters(pageNumberOrFilters)) {
      // GET /api/v4/products?search=…&pageNumber=…&pageSize=…
      return this.getFilteredList(buildListQuery(pageNumberOrFilters ?? {}));
    }
    return super.getList(pageNumberOrFilters, pageSize as number);
  }
}

/**
 * Query string de los filtros asignados, sin el signo `?`.
 * @param {ProductListFilters} filters - Filtros de la lista
 * @returns {string} Query string, vacía si no hay filtros
 */
function buildListQuery(filters: ProductListFilters): string {
  return toQueryString([
    ['search', filters.search],
    ['pageNumber', filters.pageNumber],
    ['pageSize', filters.pageSize],
  ]);
}
