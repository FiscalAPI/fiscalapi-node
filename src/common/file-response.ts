 
/**
 * File response from the API.
 *Por ejemplo: Modelo de respuesta de generación de PDF o recuperación de XML
 */
export interface FileResponse {
    /**
     * File content as a base64 string
     */
    base64Content: string;
    
    /**
     * File name
     */
    fileName: string;
    
    /**
     * Content type
     */
    contentType: string;
  }