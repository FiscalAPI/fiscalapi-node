/**
 * Modelo de respuesta de los endpoints que devuelven un archivo.
 * Por ejemplo: generación del PDF o recuperación del XML de una factura.
 */
export interface FileResponse {
    /**
     * Contenido del archivo en base64
     */
    base64File?: string;

    /**
     * Nombre del archivo
     */
    fileName?: string;

    /**
     * Extensión del archivo
     */
    fileExtension?: string;
  }
