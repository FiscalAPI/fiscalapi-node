import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../common/api-response';

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
}