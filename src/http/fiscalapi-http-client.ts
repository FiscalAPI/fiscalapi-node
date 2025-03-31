import { 
  AxiosInstance, 
  AxiosError, 
  AxiosResponse, 
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';
import { FiscalapiSettings } from './../common/fiscalapi-settings';
import { IFiscalapiHttpClient, HttpMethod, RequestOptions } from './fiscalapi-http-client.interface';
import { ApiResponse, ProblemDetails, ValidationFailure } from '../common/api-response';

/**
 * Cliente HTTP para FiscalAPI
 */
export class FiscalapiHttpClient implements IFiscalapiHttpClient {
  private readonly httpClient: AxiosInstance;
  private readonly settings: FiscalapiSettings;

  /**
   * Crea una nueva instancia del cliente HTTP para FiscalAPI
   * @param {AxiosInstance} httpClient - Instancia de Axios configurada
   * @param {FiscalapiSettings} settings - Configuración para el cliente FiscalAPI
   */
  constructor(httpClient: AxiosInstance, settings: FiscalapiSettings) {
    this.httpClient = httpClient;
    this.settings = settings;

    // Configurar interceptores para el logging en modo debug
    if (this.settings.debug) {
      this.setupDebugInterceptors();
    }
  }

  /**
   * Configura los interceptores para logear las peticiones y respuestas en modo debug
   * @private
   */
  private setupDebugInterceptors(): void {
    // Interceptor para peticiones
    this.httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      this.logRequest(config);
      return config;
    });

    // Interceptor para respuestas
    this.httpClient.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logResponse(response);
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          this.logResponse(error.response);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Logea los detalles de una petición HTTP cuando el modo debug está activado
   * @param {InternalAxiosRequestConfig} config - Configuración de la petición
   * @private
   */
  private logRequest(config: InternalAxiosRequestConfig): void {
    if (this.settings.debug) {
      console.log('');
      console.log('********************** Raw Request **************************');
      
      console.log('Method: ',  config.method?.toUpperCase());
      console.log('BaseURL: ', config.baseURL);
      console.log('PathURL: ', config.url);
      const resource = `${config.baseURL || ''}/${config.url || ''}`;
      console.log('FullURL: ', resource);
      
      if (config.data) {
        console.log('Body:', typeof config.data === 'string' ? config.data : JSON.stringify(config.data, null, 2));
      }
      
      console.log('');
      
      if (config.params) {
        console.log('Params:', config.params);
      }
      
      console.log('');
    }
  }

  /**
   * Logea los detalles de una respuesta HTTP cuando el modo debug está activado
   * @param {AxiosResponse} response - Respuesta de la petición
   * @private
   */
  private logResponse(response: AxiosResponse): void {
    if (this.settings.debug) {
      console.log('');
      console.log('********************** Raw Response **************************');
      console.log('');
      console.log('Status:', response.status, response.statusText);
      //console.log('Headers:', response.headers);
      console.log('Data:', JSON.stringify(response.data, null, 2));

      console.log('');
      console.log('*************************************************************');
      console.log('');
    }
  }

  /**
   * Ejecuta una petición HTTP genérica con control completo sobre los parámetros
   * @param {HttpMethod} method - Método HTTP a utilizar
   * @param {string} endpoint - Punto final de la API
   * @param {RequestOptions<TData>} options - Opciones de la petición
   * @returns {Promise<ApiResponse<TResult>>} Respuesta de la API
   * @template TResult - Tipo de datos esperado en la respuesta
   * @template TData - Tipo de datos a enviar en la petición (opcional)
   */
  async executeRequest<TResult, TData = any>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions<TData> = {}
  ): Promise<ApiResponse<TResult>> {
    try {
      // Extraer opciones
      const { data, queryParams, config = {}, responseTransformer } = options;
      
      // Construir configuración de la petición
      const requestConfig: AxiosRequestConfig = {
        ...config,
        method,
        url: endpoint
      };
      
      // Añadir parámetros de consulta si existen
      if (queryParams && Object.keys(queryParams).length > 0) {
        requestConfig.params = {
          ...(requestConfig.params || {}),
          ...queryParams
        };
      }
      
      // Ejecutar la petición según el método
      let response: AxiosResponse;
      
      // Los métodos que no aceptan cuerpo en la petición
      if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS' || method === 'DELETE') {
        // Para DELETE podríamos querer enviar datos en el cuerpo si es necesario
        if (method === 'DELETE' && data) {
          // Aunque no es estándar, algunas APIs aceptan body en DELETE
          requestConfig.data = data;
        }
        response = await this.httpClient.request(requestConfig);
      } else {
        // Métodos que aceptan cuerpo (POST, PUT, PATCH)
        requestConfig.data = data;
        response = await this.httpClient.request(requestConfig);
      }
      
      // Procesar la respuesta
      let processedResponse = await this.processResponse<TResult>(response);
      
      // Aplicar transformador personalizado si se proporciona
      if (responseTransformer && processedResponse.succeeded) {
        try {
          const transformedData = responseTransformer(processedResponse.data);
          processedResponse = {
            ...processedResponse,
            data: transformedData as TResult
          };
        } catch (transformError) {
          return {
            data: {} as TResult,
            succeeded: false,
            message: `Error al transformar la respuesta: ${transformError instanceof Error ? transformError.message : 'Error desconocido'}`,
            details: transformError instanceof Error ? transformError.stack || '' : '',
            httpStatusCode: processedResponse.httpStatusCode
          };
        }
      }
      
      return processedResponse;
    } catch (error) {
      return this.handleRequestError<TResult>(error);
    }
  }
  
  /**
   * Procesa la respuesta HTTP y la convierte en ApiResponse
   * @param {AxiosResponse} response - Respuesta HTTP original
   * @returns {ApiResponse<T>} Respuesta procesada
   * @template T - Tipo de datos esperado
   * @private
   */
  private async processResponse<T>(response: AxiosResponse): Promise<ApiResponse<T>> {
    // Si la respuesta ya es un ApiResponse, lo retornamos con el tipo correcto
    if (
      response.data && 
      typeof response.data === 'object' && 
      'succeeded' in response.data && 
      'data' in response.data
    ) {
      // La respuesta es un ApiResponse<T>
      const apiResponse = response.data as unknown as ApiResponse<T>;
      
      // Aseguramos que el httpStatusCode refleje el status de la respuesta HTTP
      return {
        ...apiResponse,
        httpStatusCode: response.status
      };
    }
    
    // La respuesta no es un ApiResponse, la encapsulamos
    return {
      data: response.data as unknown as T,
      succeeded: true,
      message: '',
      details: '',
      httpStatusCode: response.status
    };
  }
  
  /**
   * Maneja los errores de las peticiones HTTP
   * @param {unknown} error - Error capturado
   * @returns {ApiResponse<T>} Respuesta de error estandarizada
   * @template T - Tipo de datos esperado
   * @private
   */
  private handleRequestError<T>(error: unknown): ApiResponse<T> {
    const axiosError = error as AxiosError;
    
    // Extraer datos de respuesta
    const responseData = axiosError.response?.data;
    
    // Revisar si es un ProblemDetails según RFC 9457
    if (
      responseData && 
      typeof responseData === 'object' && 
      'type' in responseData && 
      'title' in responseData &&
      'status' in responseData
    ) {
      const problemDetails = responseData as ProblemDetails;
      
      return {
        data: {} as T,
        succeeded: false,
        message: problemDetails.title,
        details: problemDetails.detail || JSON.stringify(problemDetails),
        httpStatusCode: axiosError.response?.status || 500
      };
    }
    
    // Revisar si es un ApiResponse<ValidationFailure[]> para errores 400
    if (
      axiosError.response?.status === 400 &&
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData &&
      Array.isArray(responseData.data)
    ) {
      const apiResponse = responseData as ApiResponse<ValidationFailure[]>;
      
      // Si hay errores de validación, extraer el primer mensaje
      if (apiResponse.data && apiResponse.data.length > 0) {
        const firstFailure = apiResponse.data[0];
        return {
          data: {} as T,
          succeeded: false,
          message: firstFailure.errorMessage,
          details: JSON.stringify(apiResponse.data),
          httpStatusCode: 400
        };
      }
    }
    
    // Respuesta de error genérica
    return {
      data: {} as T,
      succeeded: false,
      message: axiosError.message || 'Ocurrió un error en la comunicación con el servidor',
      details: JSON.stringify(responseData || {}),
      httpStatusCode: axiosError.response?.status || 500
    };
  }

  /**
   * Realiza una petición GET a la API
   * @param {string} endpoint - Punto final de la API
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API
   * @template T - Tipo de datos esperado en la respuesta
   */
  async getAsync<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('GET', endpoint, { config });
  }

  /**
   * Realiza una petición GET por ID a la API
   * @param {string} endpoint - Punto final de la API con ID
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API
   * @template T - Tipo de datos esperado en la respuesta
   */
  async getByIdAsync<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('GET', endpoint, { config });
  }

  /**
   * Realiza una petición POST a la API
   * @param {string} endpoint - Punto final de la API
   * @param {TData} data - Datos a enviar en la petición
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API
   * @template T - Tipo de datos esperado en la respuesta
   * @template TData - Tipo de datos a enviar en la petición
   */
  async postAsync<T, TData = Record<string, unknown>>(
    endpoint: string, 
    data: TData, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T, TData>('POST', endpoint, { data, config });
  }

  /**
   * Realiza una petición PUT a la API
   * @param {string} endpoint - Punto final de la API
   * @param {TData} data - Datos a enviar en la petición
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API
   * @template T - Tipo de datos esperado en la respuesta
   * @template TData - Tipo de datos a enviar en la petición
   */
  async putAsync<T, TData = Record<string, unknown>>(
    endpoint: string, 
    data: TData, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T, TData>('PUT', endpoint, { data, config });
  }

  /**
   * Realiza una petición DELETE a la API
   * @param {string} endpoint - Punto final de la API
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<boolean>>} Respuesta de la API
   */
  async deleteAsync(
    endpoint: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<boolean>> {
    return this.executeRequest<boolean>('DELETE', endpoint, { config });
  }

  /**
   * Realiza una petición PATCH a la API
   * @param {string} endpoint - Punto final de la API
   * @param {TData} data - Datos a enviar en la petición
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API
   * @template T - Tipo de datos esperado en la respuesta
   * @template TData - Tipo de datos a enviar en la petición
   */
  async patchAsync<T, TData = Record<string, unknown>>(
    endpoint: string, 
    data: TData, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T, TData>('PATCH', endpoint, { data, config });
  }
}