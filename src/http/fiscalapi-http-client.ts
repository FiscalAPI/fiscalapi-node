import { 
  AxiosInstance, 
  AxiosError, 
  AxiosResponse, 
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';
import { FiscalapiSettings } from './../common/fiscalapi-settings';
import { IFiscalapiHttpClient } from './fiscalapi-http-client.interface';
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
      const resource = `${config.method?.toUpperCase() || ''}: ${config.baseURL || ''}${config.url || ''}`;
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
   * Ejecuta una petición HTTP y procesa la respuesta
   * @param {Promise<AxiosResponse<TRaw>>} request - Promesa de la petición Axios
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API procesada
   * @template T - Tipo de datos esperado en la respuesta
   * @template TRaw - Tipo de datos crudo de la respuesta
   * @private
   */
  private async executeAsync<T, TRaw = T>(request: Promise<AxiosResponse<TRaw>>): Promise<ApiResponse<T>> {
    try {
      const response = await request;
      
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
    } catch (error) {
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
  }

  /**
   * Realiza una petición GET a la API
   * @param {string} endpoint - Punto final de la API
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API
   * @template T - Tipo de datos esperado en la respuesta
   */
  async getAsync<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeAsync<T>(this.httpClient.get<T>(endpoint, config));
  }

  /**
   * Realiza una petición GET por ID a la API
   * @param {string} endpoint - Punto final de la API con ID
   * @param {AxiosRequestConfig} [config] - Configuración adicional para la petición
   * @returns {Promise<ApiResponse<T>>} Respuesta de la API
   * @template T - Tipo de datos esperado en la respuesta
   */
  async getByIdAsync<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeAsync<T>(this.httpClient.get<T>(endpoint, config));
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
    return this.executeAsync<T>(this.httpClient.post<T>(endpoint, data, config));
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
    return this.executeAsync<T>(this.httpClient.put<T>(endpoint, data, config));
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
    return this.executeAsync<boolean>(this.httpClient.delete(endpoint, config));
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
    return this.executeAsync<T>(this.httpClient.patch<T>(endpoint, data, config));
  }
}