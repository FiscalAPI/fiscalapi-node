import { AxiosInstance, AxiosError } from 'axios';
import { IFiscalapiHttpClient } from './fiscalapi-http-client.interface';
import { ApiResponse } from '../common/api-response';


/**
 * Implementación del cliente HTTP para FiscalAPI
 */
export class FiscalapiHttpClient implements IFiscalapiHttpClient {
  private readonly httpClient: AxiosInstance;

  /**
   * Crea una nueva instancia del cliente HTTP
   * @param {AxiosInstance} httpClient - Instancia de Axios
   */
  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  /**
   * Maneja las respuestas de las llamadas a la API
   * @param {Promise<any>} request - Promesa de la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API procesada
   * @template T
   * @private
   */
  private async handleResponse<T>(request: Promise<any>): Promise<ApiResponse<T>> {
    try {
      const response = await request;
      
      return {
        data: response.data,
        succeeded: true,
        message: '',
        details: '',
        httpStatusCode: response.status
      };
    } catch (error) {
      const axiosError = error as AxiosError;  
      
      return {
        data: null as unknown as T,
        succeeded: false,
        message: axiosError.message || 'Ocurrió un error',
        details: JSON.stringify(axiosError.response?.data || {}),
        httpStatusCode: axiosError.response?.status || 500
      };
    }
  }

  /**
   * @inheritdoc
   */
  async getAsync<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.handleResponse<T>(this.httpClient.get(endpoint));
  }

  /**
   * @inheritdoc
   */
  async getByIdAsync<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.handleResponse<T>(this.httpClient.get(endpoint));
  }

  /**
   * @inheritdoc
   */
  async postAsync<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse<T>(this.httpClient.post(endpoint, data));
  }

  /**
   * @inheritdoc
   */
  async putAsync<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse<T>(this.httpClient.put(endpoint, data));
  }

  /**
   * @inheritdoc
   */
  async deleteAsync(endpoint: string): Promise<ApiResponse<boolean>> {
    return this.handleResponse<boolean>(this.httpClient.delete(endpoint));
  }
}