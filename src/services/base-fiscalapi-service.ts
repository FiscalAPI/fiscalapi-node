import { AxiosRequestConfig } from 'axios';
import { BaseDto } from '../common/base-dto';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { IFiscalapiService, OperationOptions } from '../abstractions/fiscalapi-service.interface';

/**
 * Implementación base de un servicio de FiscalAPI
 * @template T - Tipo de DTO que maneja el servicio
 */
export abstract class BaseFiscalapiService<T extends BaseDto> implements IFiscalapiService<T> {
  /** Cliente HTTP */
  protected readonly httpClient: IFiscalapiHttpClient;
  
  /** Ruta del recurso */
  protected readonly resourcePath: string;
  
  /** Versión de la API */
  protected readonly apiVersion: string;

  /**
   * Crea una nueva instancia del servicio base
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} resourcePath - Ruta del recurso en la API
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, resourcePath: string, apiVersion: string) {
    if (!httpClient) throw new Error('httpClient no puede ser nulo o indefinido');
    if (!resourcePath) throw new Error('resourcePath no puede ser nulo o indefinido');
    if (!apiVersion) throw new Error('apiVersion no puede ser nulo o indefinido');
    
    this.httpClient = httpClient;
    this.resourcePath = resourcePath;
    this.apiVersion = apiVersion;
  }

  /**
   * Construye una URL de endpoint de API
   * @param {string} [path=''] - Segmento de ruta opcional
   * @param {Record<string, string>} [queryParams] - Parámetros de consulta opcionales
   * @returns {string} URL del endpoint
   * @protected
   */
  protected buildEndpoint(path: string = '', queryParams?: Record<string, string>): string {
    let baseEndpoint = `api/${this.apiVersion}/${this.resourcePath}`;
    
    if (path) {
      baseEndpoint += `/${path}`;
    }
    
    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = Object.entries(queryParams)
        .filter(([key]) => key)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      baseEndpoint += `?${queryString}`;
    }
    
    return baseEndpoint;
  }

  /**
   * Convierte los parámetros de consulta a un objeto compatible con la configuración de Axios
   * @param {Record<string, string>} queryParams - Parámetros de consulta
   * @returns {AxiosRequestConfig} Configuración de Axios con los parámetros
   * @protected
   */
  protected createConfigWithParams(queryParams?: Record<string, string>): AxiosRequestConfig {
    return queryParams ? { params: queryParams } : {};
  }

  /**
   * @inheritdoc
   */
  async getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<T>>> {
    const queryParams = {
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString()
    };
    
    // Usamos la configuración de Axios para pasar los parámetros
    const config: AxiosRequestConfig = {
      params: queryParams
    };
    
    return this.httpClient.getAsync<PagedList<T>>(
      this.buildEndpoint(),
      config
    );
  }

  /**
   * @inheritdoc
   */
  async getById(id: string, details: boolean = false): Promise<ApiResponse<T>> {
    const queryParams = details ? { details: details.toString().toLowerCase() } : undefined;
    
    // Usamos la configuración de Axios para pasar los parámetros
    const config: AxiosRequestConfig = queryParams ? {
      params: queryParams
    } : {};
    
    return this.httpClient.getByIdAsync<T>(
      this.buildEndpoint(id),
      config
    );
  }

  /**
   * @inheritdoc
   */
  async create(model: T): Promise<ApiResponse<T>> {
    return this.httpClient.postAsync<T, T>(
      this.buildEndpoint(),
      model
    );
  }

  /**
   * @inheritdoc
   */
  async update(model: T): Promise<ApiResponse<T>> {
    return this.httpClient.putAsync<T, T>(
      this.buildEndpoint(model.id),
      model
    );
  }

  /**
   * @inheritdoc
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    return this.httpClient.deleteAsync(
      this.buildEndpoint(id)
    );
  }

  /**
   * Delete with body
   */
  async deleteWithBody(id: string, body: any): Promise<ApiResponse<boolean>> {
    return this.httpClient.deleteAsync(
      this.buildEndpoint(id),
      body
    );
  }
 




  /**
   * Realiza una búsqueda en el recurso
   * @param {Record<string, string>} searchParams - Parámetros de búsqueda
   * @returns {Promise<ApiResponse<PagedList<T>>>} Resultados de la búsqueda
   */
  async search(searchParams: Record<string, string>): Promise<ApiResponse<PagedList<T>>> {
    // Usamos la configuración de Axios para pasar los parámetros de búsqueda
    const config: AxiosRequestConfig = {
      params: searchParams
    };
    
    return this.httpClient.getAsync<PagedList<T>>(
      this.buildEndpoint('search'),
      config
    );
  }

  /**
   * Ejecuta una acción personalizada en un recurso
   * @param {string} id - ID del recurso
   * @param {string} action - Nombre de la acción
   * @param {Record<string, unknown>} [data] - Datos opcionales para la acción
   * @returns {Promise<ApiResponse<TResult>>} Resultado de la acción
   * @template TResult - Tipo de resultado esperado
   */
  async executeAction<TResult, TData>(
    id: string,
    action: string,
    data?: TData
  ): Promise<ApiResponse<TResult>> {
    const endpoint = this.buildEndpoint(`${id}/${action}`);
    
    if (data) {
      return this.httpClient.postAsync<TResult, TData>(endpoint, data);
    } else {
      return this.httpClient.getAsync<TResult>(endpoint);
    }
  }
  
  // /**
  //  * Ejecuta una operación personalizada en el recurso sin necesidad de un ID específico
  //  * @param {string} path - Nombre de la operación
  //  * @param {TData} data - Datos para la operación
  //  * @returns {Promise<ApiResponse<TResult>>} Resultado de la operación
  //  * @template TResult - Tipo de resultado esperado
  //  * @template TData - Tipo de datos de entrada
  //  */
  // async executeOperation<TResult, TData>(
  //   path: string,
  //   data: TData,
  //   method: 'POST' | 'PUT' | 'DELETE'
  // ): Promise<ApiResponse<TResult>> {
  //   const endpoint = this.buildEndpoint(path);

  //   if (method === 'POST') {
  //     return this.httpClient.postAsync<TResult, TData>(endpoint, data);
  //   } else if (method === 'PUT') {
  //     return this.httpClient.putAsync<TResult, TData>(endpoint, data);
  //   } else if (method === 'DELETE' && data) {
  //     return this.httpClient.deleteWithBodyAsync<TResult, TData>(endpoint, data);
  //   }

  /**
 * Ejecuta una operación personalizada en el recurso sin necesidad de un ID específico
 * @param {OperationOptions<TData>} options - Opciones para la operación
 * @returns {Promise<ApiResponse<TResult>>} Resultado de la operación
 * @template TResult - Tipo de resultado esperado
 * @template TData - Tipo de datos de entrada
 */
async executeOperation<TResult, TData = any>(
  options: OperationOptions<TData>
): Promise<ApiResponse<TResult>> {
  // Establecer valores predeterminados para opciones que no se proporcionaron
  const path = options.path;
  const data = options.data;
  const queryParams = options.queryParams || {};
  const method = options.method || 'POST';
  const config = options.config || {};
  
  // Construir endpoint con parámetros de consulta
  const endpoint = this.buildEndpoint(path, queryParams);
  
  // Combinar configuración personalizada con la configuración predeterminada
  const requestConfig: AxiosRequestConfig = {
    ...config
  };
  
  // Si hay parámetros de consulta, agregarlos a la configuración
  if (config.params) {
    requestConfig.params = {
      ...config.params
    };
  }
  
  if (Object.keys(queryParams).length > 0) {
    if (!requestConfig.params) {
      requestConfig.params = {};
    }
    
    for (const key in queryParams) {
      requestConfig.params[key] = queryParams[key];
    }
  }
  
  try {
    if (method === 'GET') {
      return await this.httpClient.getAsync<TResult>(endpoint, requestConfig);
    }
    
    if (method === 'POST') {
      return await this.httpClient.postAsync<TResult, TData>(
        endpoint, 
        data as TData, 
        requestConfig
      );
    }
    
    if (method === 'PUT') {
      return await this.httpClient.putAsync<TResult, TData>(
        endpoint, 
        data as TData, 
        requestConfig
      );
    }
    
    if (method === 'PATCH') {
      if (typeof this.httpClient.patchAsync === 'function') {
        return await this.httpClient.patchAsync<TResult, TData>(
          endpoint, 
          data as TData, 
          requestConfig
        );
      }
      throw new Error('Método PATCH no implementado en el cliente HTTP');
    }
    
    if (method === 'DELETE') {
      return await this.httpClient.deleteAsync(endpoint, requestConfig) as ApiResponse<TResult>;
    }
    
    throw new Error(`Método HTTP no soportado: ${method}`);
  } catch (error) {
    // Manejo centralizado de errores
    console.error(`Error al ejecutar operación en '${path}':`, error);
    
    // Convertir el error en una respuesta de error estándar
    if (error instanceof Error) {
      const errorResponse: ApiResponse<TResult> = {
        succeeded: false,
        data: null as unknown as TResult,
        message: `Error al ejecutar operación: ${error.message}`,
        details: JSON.stringify({
          code: 'OPERATION_ERROR',
          message: error.message,
          path: path
        }),
        httpStatusCode: 500
      };
  
  return errorResponse;
}
    
    throw error;
  }
}



}