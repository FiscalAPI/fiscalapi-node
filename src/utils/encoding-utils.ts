 
/**
 * Codifica una cadena a base64
 * @param {string} text - Texto a codificar
 * @returns {string} Cadena codificada en base64
 */
export function encodeToBase64(text: string): string {
    return Buffer.from(text).toString('base64');
  }
  
  /**
   * Decodifica una cadena base64
   * @param {string} base64Text - Cadena codificada en base64
   * @returns {string} Cadena decodificada
   */
  export function decodeFromBase64(base64Text: string): string {
    return Buffer.from(base64Text, 'base64').toString('utf8');
  }