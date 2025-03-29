 
/**
 * Encapsulador genérico para respuestas de la API
 * @template T
 */
export interface ApiResponse<T> {
    /**
     * Datos de la respuesta
     */
    data: T;
    
    /**
     * Indica si la petición fue exitosa
     */
    succeeded: boolean;
    
    /**
     * Mensaje de error o de éxito
     */
    message: string;
    
    /**
     * Detalles adicionales del error
     */
    details: string;
    
    /**
     * Código de estado HTTP
     */
    httpStatusCode: number;
  }
  
  /**
 * Detalles de errores de validación
 */
export interface ValidationFailure {
    /**
     * Nombre de la propiedad que falló en la validación
     */
    propertyName: string;
    
    /**
     * Mensaje de error
     */
    errorMessage: string;
    
    /**
     * Valor que se intentó establecer
     */
    attemptedValue: any;
  }