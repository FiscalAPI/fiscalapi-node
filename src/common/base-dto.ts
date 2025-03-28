 
const { DateTime } = require('luxon');

class BaseDto {

    
  /**
   * Sobrescribe el método toJSON para:
   * 1. Formatear automáticamente propiedades DateTime de Luxon
   * 2. Excluir propiedades falsy (null, undefined, '', 0, false)
   * 3. Manejar recursivamente objetos anidados y arrays
   * 4. Manejar edge cases como referencias circulares, valores especiales, etc.
   * @param {string} dateFormat - Formato de fecha (por defecto ISO)
   * @param {boolean} excludeFalsy - Si se deben excluir valores falsy
   * @returns {Object} - Objeto JSON limpio
   */
  toJSON(dateFormat = "yyyy-MM-dd'T'HH:mm:ss", excludeFalsy = true) {
    // Set para detectar referencias circulares
    const visited = new WeakSet();
    
    const processValue = (value) => {
      // Si es null o undefined
      if (value === null || value === undefined) {
        return excludeFalsy ? undefined : null;
      }
      
      // Si es un DateTime de Luxon
      if (value instanceof DateTime) {
        // Verificar si es válido
        if (!value.isValid) {
          return excludeFalsy ? undefined : null;
        }
        return value.toFormat(dateFormat);
      }
      
      // Si es un array
      if (Array.isArray(value)) {
        // Procesamos cada elemento y filtramos valores undefined si excludeFalsy es true
        const processedArray = value
          .map(item => processValue(item))
          .filter(item => !excludeFalsy || item !== undefined);
        
        // Devolvemos array vacío o undefined según configuración
        return processedArray.length > 0 ? processedArray : (excludeFalsy ? undefined : []);
      }
      
      // Si es un objeto (pero no Date nativa)
      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        return processObject(value);
      }
      
      // Si es una instancia de Date nativa
      if (value instanceof Date) {
        return DateTime.fromJSDate(value).toFormat(dateFormat);
      }
      
      // Para valores especiales de JavaScript (NaN, Infinity, -Infinity)
      if (typeof value === 'number' && !isFinite(value)) {
        return excludeFalsy ? undefined : null;
      }
      
      // Para funciones (siempre las excluimos)
      if (typeof value === 'function') {
        return undefined;
      }
      
      // Para BigInt (convertir a string)
      if (typeof value === 'bigint') {
        return value.toString();
      }
      
      // Para Symbol (convertir a string descriptiva)
      if (typeof value === 'symbol') {
        return value.toString();
      }
      
      // Para strings vacíos, números 0 y booleanos false
      if (excludeFalsy && (value === '' || value === 0 || value === false)) {
        return undefined;
      }
      
      // Cualquier otro valor lo devolvemos tal cual
      return value;
    };
    
    const processObject = (obj) => {
      // Verificar objeto nulo o undefined
      if (!obj) return excludeFalsy ? undefined : null;
      
      // Detectar referencias circulares
      if (visited.has(obj)) {
        return "[Referencia Circular]";
      }
      
      // Agregamos el objeto al conjunto de visitados
      visited.add(obj);
      
      // Manejar Map
      if (obj instanceof Map) {
        const entries = Array.from(obj.entries()).map(([k, v]) => {
          return { key: String(k), value: processValue(v) };
        }).filter(entry => !excludeFalsy || entry.value !== undefined);
        
        return entries.length > 0 ? entries : (excludeFalsy ? undefined : []);
      }
      
      // Manejar Set
      if (obj instanceof Set) {
        const values = Array.from(obj.values())
          .map(v => processValue(v))
          .filter(value => !excludeFalsy || value !== undefined);
          
        return values.length > 0 ? values : (excludeFalsy ? undefined : []);
      }
      
      // Si el objeto tiene su propio método toJSON, lo usamos
      // pero pasamos nuestros parámetros si la función los acepta
      if (obj !== this && typeof obj.toJSON === 'function') {
        try {
          const paramCount = obj.toJSON.length;
          if (paramCount >= 2) {
            return obj.toJSON(dateFormat, excludeFalsy);
          } else if (paramCount === 1) {
            return obj.toJSON(dateFormat);
          } else {
            return obj.toJSON();
          }
        } catch (error) {
          console.warn(`Error en método toJSON personalizado: ${error.message}`);
          // Continuamos con el procesamiento normal si falla el método toJSON
        }
      }
      
      const result = {};
      let hasValues = false;
      
      // Iteramos sobre todas las propiedades (solo las propias)
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          try {
            const processed = processValue(obj[key]);
            
            if (!excludeFalsy || processed !== undefined) {
              result[key] = processed;
              hasValues = true;
            }
          } catch (error) {
            // Si hay un error al procesar un valor, lo omitimos y continuamos
            console.warn(`Error al procesar la propiedad "${key}": ${error.message}`);
          }
        }
      }
      
      return hasValues ? result : (excludeFalsy ? undefined : {});
    };
    
    try {
      // Procesamos el objeto actual
      return processObject(this);
    } catch (error) {
      console.error(`Error global en toJSON: ${error.message}`);
      // En caso de error global, devolvemos un objeto vacío o alguna información de error
      return excludeFalsy ? undefined : { error: 'Error en serialización' };
    }
  }
}
