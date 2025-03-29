import { DateTime } from 'luxon';

/**
 * Clase base que proporciona funcionalidad de serialización para modelos de datos
 */
export class SerializableDto {
  
  /**
   * Convierte la instancia a una representación JSON en forma de string
   * @returns {string} Representación JSON del objeto
   */
  toString(): string {
    try {
      // Custom replacer function to handle dates correctly
      const replacer = (_key: string, value: any) => {
        // Handle DateTime objects
        if (value instanceof DateTime) {
          return value.toISO();
        }
        return value;
      };
      
      return JSON.stringify(this, replacer, 2);
    } catch (error) {
      return '{"error":"Error generating JSON"}';
    }
  }
  
  /**
   * Custom implementation to ensure object is correctly serialized in console.log
   */
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.toString();
  }
}