import { IFiscalapiService } from './fiscalapi-service.interface';
import { ApiKey } from '../models/api-key';

/**
 * Interfaz del servicio de claves de API
 */
export interface IApiKeyService extends IFiscalapiService<ApiKey> {
  // Aquí irían métodos específicos para claves de API
}