import { ApiResponse } from '../common/api-response';
import { BaseDto } from '../common/base-dto';
import { PagedList } from '../common/paged-list';

/**
 * Interfaz base para todos los servicios de FiscalAPI
 * @template T - Tipo de DTO que maneja el servicio
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
  update(model: T): Promise<ApiResponse<T>>;
  
  /**
   * Elimina un recurso
   * @param {string} id - ID del recurso
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  delete(id: string): Promise<ApiResponse<boolean>>;
  
  /**
   * Realiza una búsqueda en el recurso
   * @param {Record<string, string>} searchParams - Parámetros de búsqueda
   * @returns {Promise<ApiResponse<PagedList<T>>>} Resultados de la búsqueda
   */
  search(searchParams: Record<string, string>): Promise<ApiResponse<PagedList<T>>>;
  
  /**
   * Ejecuta una acción personalizada en un recurso
   * @param {string} id - ID del recurso
   * @param {string} action - Nombre de la acción
   * @param {TData} [data] - Datos opcionales para la acción
   * @returns {Promise<ApiResponse<TResult>>} Resultado de la acción
   * @template TResult - Tipo de resultado esperado
   * @template TData - Tipo de datos de entrada
   */
  executeAction<TResult, TData>(
    id: string,
    action: string,
    data?: TData
  ): Promise<ApiResponse<TResult>>;
  
  /**
   * Ejecuta una operación personalizada en el recurso sin necesidad de un ID específico
   * @param {string} operation - Nombre de la operación
   * @param {TData} data - Datos para la operación
   * @returns {Promise<ApiResponse<TResult>>} Resultado de la operación
   * @template TResult - Tipo de resultado esperado
   * @template TData - Tipo de datos de entrada
   */
  executeOperation<TResult, TData>(
    operation: string,
    data: TData
  ): Promise<ApiResponse<TResult>>;
}