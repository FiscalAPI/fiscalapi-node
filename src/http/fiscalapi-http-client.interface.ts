import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../common/api-response';

/**
 * Métodos HTTP soportados
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Opciones para una petición HTTP genérica
 * @template TData - Tipo de datos de entrada (opcional)
 */
export interface RequestOptions<TData = any> {
  /** Datos para enviar en el cuerpo de la petición (opcional) */
  data?: TData;
  /** Parámetros de consulta (query string) (opcional) */
  queryParams?: Record<string, string>;
  /** Configuración adicional para Axios (opcional) */
  config?: AxiosRequestConfig;
  /** Transformador de respuesta personalizado (opcional) */
  responseTransformer?: <T>(response: any) => T;
}

/**
 * Interfaz para el cliente HTTP de FiscalAPI
 */
export interface IFiscalapiHttpClient {
  /**
   * Realiza una petición GET a la API
   * @param endpoint - Punto final de la API
   * @param config - Configuración adicional para la petición
   * @returns Respuesta de la API
   */
  getAsync<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * Realiza una petición GET por ID a la API
   * @param endpoint - Punto final de la API con ID
   * @param config - Configuración adicional para la petición
   * @returns Respuesta de la API
   */
  getByIdAsync<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * Realiza una petición POST a la API
   * @param endpoint - Punto final de la API
   * @param data - Datos a enviar en la petición
   * @param config - Configuración adicional para la petición
   * @returns Respuesta de la API
   */
  postAsync<T, TData = Record<string, unknown>>(
    endpoint: string,
    data: TData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>>;

  /**
   * Realiza una petición PUT a la API
   * @param endpoint - Punto final de la API
   * @param data - Datos a enviar en la petición
   * @param config - Configuración adicional para la petición
   * @returns Respuesta de la API
   */
  putAsync<T, TData = Record<string, unknown>>(
    endpoint: string,
    data: TData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>>;

  /**
   * Realiza una petición DELETE a la API
   * @param endpoint - Punto final de la API
   * @param config - Configuración adicional para la petición
   * @returns Respuesta de la API
   */
  deleteAsync(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<boolean>>;

  /**
   * Realiza una petición PATCH a la API
   * @param endpoint - Punto final de la API
   * @param data - Datos a enviar en la petición
   * @param config - Configuración adicional para la petición
   * @returns Respuesta de la API
   */
  patchAsync<T, TData = Record<string, unknown>>(
    endpoint: string,
    data: TData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>>;

  /**
   * Ejecuta una petición HTTP genérica con control completo sobre los parámetros
   * @param method - Método HTTP a utilizar
   * @param endpoint - Punto final de la API
   * @param options - Opciones de la petición
   * @returns Respuesta de la API
   * @template TResult - Tipo de datos esperado en la respuesta
   * @template TData - Tipo de datos a enviar en la petición (opcional)
   */
  executeRequest<TResult, TData = any>(
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions<TData>
  ): Promise<ApiResponse<TResult>>;
}