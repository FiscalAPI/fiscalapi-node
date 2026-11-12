// src/abstractions/interfaces/product-service.interface.ts
import { IFiscalapiService } from './fiscalapi-service.interface';
import { Product, ProductListFilters } from '../models/product';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';

/**
 * Interfaz del servicio de productos
 */
export interface IProductService extends IFiscalapiService<Product> {
  /**
   * GET /api/v4/products?PageNumber=…&PageSize=…
   * Recupera una página de productos, sin filtros.
   * @param {number} pageNumber - Número de página (base 1)
   * @param {number} pageSize - Número de elementos por página
   * @returns {Promise<ApiResponse<PagedList<Product>>>} Página de productos
   */
  getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<Product>>>;

  /**
   * GET /api/v4/products
   * Lista los productos del tenant con los filtros asignados (sin filtros: la lista de siempre, primera página).
   * @param {ProductListFilters} [filters] - Filtros de la consulta
   * @returns {Promise<ApiResponse<PagedList<Product>>>} Página de productos
   */
  getList(filters?: ProductListFilters): Promise<ApiResponse<PagedList<Product>>>;
}
