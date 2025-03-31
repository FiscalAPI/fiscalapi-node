import { AxiosRequestConfig } from 'axios';
import { BaseDto } from '../common/base-dto';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { IFiscalapiHttpClient, HttpMethod } from '../http/fiscalapi-http-client.interface';
import { IFiscalapiService, OperationOptions, RequestOptions } from '../abstractions/fiscalapi-service.interface';

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
   * Ejecuta una petición HTTP personalizada con máxima flexibilidad
   * @param {RequestOptions<TData>} options - Opciones para la petición
   * @returns {Promise<ApiResponse<TResult>>} Resultado de la petición
   * @template TResult - Tipo de resultado esperado
   * @template TData - Tipo de datos de entrada
   */
  async executeRequest<TResult, TData = any>(
    options: RequestOptions<TData>
  ): Promise<ApiResponse<TResult>> {
    try {
      // Extraer opciones
      const { 
        method, 
        path = '', 
        id, 
        data, 
        queryParams = {}, 
        config = {},
        responseTransformer
      } = options;
      
      // Construir el endpoint completo
      let endpoint = '';
      
      // Si se proporciona un ID, lo añadimos a la ruta
      if (id) {
        endpoint = this.buildEndpoint(`${path ? `${path}/` : ''}${id}`, queryParams);
      } else if (path) {
        endpoint = this.buildEndpoint(path, queryParams);
      } else {
        endpoint = this.buildEndpoint('', queryParams);
      }
      
      // Ejecutar la petición a través del cliente HTTP
      return this.httpClient.executeRequest<TResult, TData>(
        method,
        endpoint,
        {
          data,
          config,
          responseTransformer
        }
      );
    } catch (error) {
      // Manejo centralizado de errores
      console.error(`Error al ejecutar petición personalizada:`, error);
      
      // Convertir el error en una respuesta de error estándar
      if (error instanceof Error) {
        const errorResponse: ApiResponse<TResult> = {
          succeeded: false,
          data: null as unknown as TResult,
          message: `Error al ejecutar petición: ${error.message}`,
          details: JSON.stringify({
            code: 'REQUEST_ERROR',
            message: error.message
          }),
          httpStatusCode: 500
        };
        
        return errorResponse;
      }
      
      throw error;
    }
  }
  
 

  /**
   * @inheritdoc
   */
  async getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<T>>> {
    const queryParams = {
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString()
    };
    
    return this.executeRequest<PagedList<T>>({
      method: 'GET',
      queryParams
    });
  }

  /**
   * @inheritdoc
   */
  async getById(id: string, details: boolean = false): Promise<ApiResponse<T>> {
    const queryParams = details ? { details: details.toString().toLowerCase() } : undefined;
    
    return this.executeRequest<T>({
      method: 'GET',
      id,
      queryParams
    });
  }

  /**
   * @inheritdoc
   */
  async create(model: T): Promise<ApiResponse<T>> {
    return this.executeRequest<T, T>({
      method: 'POST',
      data: model
    });
  }

  /**
   * @inheritdoc
   */
  async update(model: T): Promise<ApiResponse<T>> {
    return this.executeRequest<T, T>({
      method: 'PUT',
      id: model.id,
      data: model
    });
  }

  /**
   * @inheritdoc
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    return this.executeRequest<boolean>({
      method: 'DELETE',
      id
    });
  }

  /**
   * @inheritdoc
   */
  async search(searchParams: Record<string, string>): Promise<ApiResponse<PagedList<T>>> {
    return this.executeRequest<PagedList<T>>({
      method: 'GET',
      path: 'search',
      queryParams: searchParams
    });
  }
}