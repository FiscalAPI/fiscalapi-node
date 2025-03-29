 
/**
 * Comprueba si un valor es nulo o indefinido
 * @param {any} value - Valor a comprobar
 * @returns {boolean} Verdadero si el valor es nulo o indefinido, falso en caso contrario
 */
export function isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }
  
  /**
   * Comprueba si una cadena es nula, indefinida o vacía
   * @param {string|null|undefined} value - Cadena a comprobar
   * @returns {boolean} Verdadero si la cadena es nula, indefinida o vacía, falso en caso contrario
   */
  export function isNullOrEmpty(value: string | null | undefined): boolean {
    return isNullOrUndefined(value) || value === '';
  }
  
  /**
   * Comprueba si un array es nulo, indefinido o vacío
   * @param {T[]|null|undefined} value - Array a comprobar
   * @returns {boolean} Verdadero si el array es nulo, indefinido o vacío, falso en caso contrario
   * @template T
   */
  export function isArrayNullOrEmpty<T>(value: T[] | null | undefined): boolean {
    return isNullOrUndefined(value) || (Array.isArray(value) && value.length === 0);
  }
  
  /**
   * Comprueba si un objeto es nulo, indefinido o no tiene propiedades
   * @param {object|null|undefined} value - Objeto a comprobar
   * @returns {boolean} Verdadero si el objeto es nulo, indefinido o no tiene propiedades, falso en caso contrario
   */
  export function isObjectEmpty(value: object | null | undefined): boolean {
    return isNullOrUndefined(value) || (typeof value === 'object' && value !== null && Object.keys(value).length === 0);
  }