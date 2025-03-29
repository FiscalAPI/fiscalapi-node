 

// src/models/api-key.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo de clave de API
 */
export class ApiKey extends BaseDto {
  /** Indica si la clave de API está activa */
  active?: boolean;
  
  /** Nombre de la clave de API */
  name?: string;
  
  /** Descripción de la clave de API */
  description?: string;
  
  /** Fecha de expiración */
  expirationDate?: string;
  
  /** Valor de la clave de API */
  key?: string;
}
