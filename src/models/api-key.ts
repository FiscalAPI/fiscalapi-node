 

// src/models/api-key.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo API Key
 * Representa una clave de autenticación en fiscalapi
 */
export interface ApiKey  extends BaseDto {
  /** El identificador único de la API key */
  id?: string;

  /** El entorno al que pertenece la API key */
  environment?: string;

  /** El API key. Este valor es el que se utiliza para autenticar las solicitudes */
  apiKeyValue?: string;

  /** El identificador único de la persona a la que pertenece la API key */
  personId?: string;

  /** El identificador único del tenant al que pertenece la API key */
  tenantId?: string;

  /** El estado de la API key. Valores: "0 Disabled  | 1 Enabled " */
  apiKeyStatus?: number;

  /** Nombre o descripción de la API key */
  description?: string;
}
