// src/models/manifest.ts

/**
 * Solicitud para firmar un manifiesto.
 * Contiene el certificado, llave privada y contraseña en base64.
 */
export interface SignManifestRequest {
  /** Certificado (.cer) en base64 */
  base64Cer?: string;

  /** Llave privada (.key) en base64 */
  base64Key?: string;

  /** Contraseña de la llave privada */
  password?: string;
}

/**
 * Respuesta de la firma de un manifiesto.
 * Contiene el archivo firmado en base64.
 */
export interface SignManifestResponse {
  /** Archivo firmado en base64 */
  base64File: string;

  /** Nombre del archivo */
  fileName: string;

  /** Extensión del archivo */
  fileExtension: string;
}
