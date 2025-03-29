 
/**
 * File response from the API
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