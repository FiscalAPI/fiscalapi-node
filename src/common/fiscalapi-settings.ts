 

/**
 * Configuración para el cliente de FiscalAPI
 */
export interface FiscalapiSettings {
    /**
   * URL base de la API de FiscalAPI
   */
  apiUrl: string;
  
  /**
   * Clave de API para autenticación
   */
  apiKey: string;
  
  /**
   * Versión de la API (predeterminado: 'v4')
   */
  apiVersion?: string;
  
  /**
   * Identificador del inquilino
   */
  tenant: string;
  
  /**
   * Zona horaria para la API (predeterminado: 'America/Mexico_City')
   */
  timeZone?: string;

  /**
   * Indica si de debe ejecutar en modo depuración, esto es, si se deben mostrar los logs de la API y deshabilitar la validación del certificado SSL
   * @default false
   */
  debug?: boolean;
}