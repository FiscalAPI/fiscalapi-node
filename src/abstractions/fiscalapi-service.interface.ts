import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../common/api-response';
import { BaseDto } from '../common/base-dto';
import { PagedList } from '../common/paged-list';
import { HttpMethod } from '../http/fiscalapi-http-client.interface';

/**
 * Opciones para ejecutar una operación
 * @template TData - Tipo de datos de entrada
 */
export type OperationOptions<TData = any> = {
  /** Ruta o nombre de la operación */
  path: string;
  /** Datos para la operación (opcional) */
  data?: TData;
  /** Parámetros de consulta (opcional) */
  queryParams?: Record<string, string>;
  /** Método HTTP a utilizar */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Configuración adicional para Axios (opcional) */
  config?: AxiosRequestConfig;
};

/**
 * Opciones para ejecutar una petición personalizada
 * @template TData - Tipo de datos de entrada
 */
export type RequestOptions<TData = any> = {
  /** Método HTTP a utilizar */
  method: HttpMethod;
  /** Ruta adicional (opcional) */
  path?: string;
  /** ID del recurso (opcional) */
  id?: string;
  /** Datos para la petición (opcional) */
  data?: TData;
  /** Parámetros de consulta (opcional) */
  queryParams?: Record<string, string>;
  /** Configuración adicional para Axios (opcional) */
  config?: AxiosRequestConfig;
  /** Transformador personalizado para la respuesta (opcional) */
  responseTransformer?: <T>(response: any) => T;
};

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
   * Ejecuta una petición HTTP personalizada con máxima flexibilidad
   * @param {RequestOptions<TData>} options - Opciones para la petición
   * @returns {Promise<ApiResponse<TResult>>} Resultado de la petición
   * @template TResult - Tipo de resultado esperado
   * @template TData - Tipo de datos de entrada
   */
  executeRequest<TResult, TData = any>(
    options: RequestOptions<TData>
  ): Promise<ApiResponse<TResult>>;
}