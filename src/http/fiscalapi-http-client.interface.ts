import { ApiResponse } from "../common/api-response";

 
/**
 * Interfaz para el cliente HTTP de FiscalAPI
 */
export interface IFiscalapiHttpClient {
    /**
     * Realiza una petición GET para obtener una lista de recursos
     * @param {string} endpoint - Endpoint de la API
     * @returns {Promise<ApiResponse<T>>} Respuesta de la API
     * @template T
     */
    getAsync<T>(endpoint: string): Promise<ApiResponse<T>>;
    
    /**
     * Realiza una petición GET para obtener un recurso específico por ID
     * @param {string} endpoint - Endpoint de la API incluyendo el ID
     * @returns {Promise<ApiResponse<T>>} Respuesta de la API
     * @template T
     */
    getByIdAsync<T>(endpoint: string): Promise<ApiResponse<T>>;
    
    /**
     * Realiza una petición POST para crear un nuevo recurso
     * @param {string} endpoint - Endpoint de la API
     * @param {any} data - Datos del recurso a crear
     * @returns {Promise<ApiResponse<T>>} Respuesta de la API
     * @template T
     */
    postAsync<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
    
    /**
     * Realiza una petición PUT para actualizar un recurso existente
     * @param {string} endpoint - Endpoint de la API incluyendo el ID
     * @param {any} data - Datos actualizados del recurso
     * @returns {Promise<ApiResponse<T>>} Respuesta de la API
     * @template T
     */
    putAsync<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
    
    /**
     * Realiza una petición DELETE para eliminar un recurso
     * @param {string} endpoint - Endpoint de la API incluyendo el ID
     * @returns {Promise<ApiResponse<boolean>>} Respuesta de la API
     */
    deleteAsync(endpoint: string): Promise<ApiResponse<boolean>>;
  }