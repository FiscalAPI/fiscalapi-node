 
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
  
  }

  /**
   * Interfaz para los detalles de problemas según RFC 9457
   */
  export interface ProblemDetails {
    /** URI de referencia que identifica el tipo de problema */
    type: string;
    /** Resumen breve y legible del tipo de problema */
    title: string;
    /** Código de estado HTTP */
    status: number;
    /** Explicación específica y legible de esta ocurrencia del problema */
    detail: string;
    /** URI de referencia que identifica la ocurrencia específica del problema */
    instance?: string;
    /** Propiedades adicionales extendidas */
    [key: string]: unknown;
  }