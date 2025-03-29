import { ApiResponse } from '../common/api-response';
import { BaseDto } from '../common/base-dto';
import { PagedList } from '../common/paged-list';

/**
 * Interfaz base para todos los servicios de FiscalAPI
 * @template T
 */
export interface IFiscalapiService<T extends BaseDto> {
  /**
   * Recupera una lista paginada de recursos
   * @param {number} pageNumber - Número de página (base 1)
   * @param {number} pageSize - Número de elementos por página
   * @returns {Promise<ApiResponse<PagedList<T>>>} Lista paginada de recursos
   */
  getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<T>>>;
  
  /**
   * Recupera un recurso específico por ID
   * @param {string} id - ID del recurso
   * @param {boolean} [details=false] - Si es verdadero, incluye objetos relacionados
   * @returns {Promise<ApiResponse<T>>} Recurso solicitado
   */
  getById(id: string, details?: boolean): Promise<ApiResponse<T>>;
  
  /**
   * Crea un nuevo recurso
   * @param {T} model - Datos del recurso
   * @returns {Promise<ApiResponse<T>>} Recurso creado
   */
  create(model: T): Promise<ApiResponse<T>>;
  
  /**
   * Actualiza un recurso existente
   * @param {string} id - ID del recurso
   * @param {T} model - Datos actualizados del recurso
   * @returns {Promise<ApiResponse<T>>} Recurso actualizado
   */
  update(id: string, model: T): Promise<ApiResponse<T>>;
  
  /**
   * Elimina un recurso
   * @param {string} id - ID del recurso
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  delete(id: string): Promise<ApiResponse<boolean>>;
}
