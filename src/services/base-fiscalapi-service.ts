 
import { BaseDto } from '../common/base-dto';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { IFiscalapiService } from '..';

/**
 * Implementación base de un servicio de FiscalAPI
 * @template T
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
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      
      baseEndpoint += `?${queryString}`;
    }
    
    return baseEndpoint;
  }

  /**
   * @inheritdoc
   */
  async getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<T>>> {
    const queryParams = {
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString()
    };
    
    return this.httpClient.getAsync<PagedList<T>>(this.buildEndpoint('', queryParams));
  }

  /**
   * @inheritdoc
   */
  async getById(id: string, details: boolean = false): Promise<ApiResponse<T>> {
    const queryParams = {
      details: details.toString().toLowerCase()
    };
    
    return this.httpClient.getByIdAsync<T>(this.buildEndpoint(id, queryParams));
  }

  /**
   * @inheritdoc
   */
  async create(model: T): Promise<ApiResponse<T>> {
    return this.httpClient.postAsync<T>(this.buildEndpoint(), model);
  }

  /**
   * @inheritdoc
   */
  async update(id: string, model: T): Promise<ApiResponse<T>> {
    return this.httpClient.putAsync<T>(this.buildEndpoint(id), model);
  }

  /**
   * @inheritdoc
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    return this.httpClient.deleteAsync(this.buildEndpoint(id));
  }
}