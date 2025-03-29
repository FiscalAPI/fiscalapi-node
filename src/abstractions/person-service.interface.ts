 
import { IFiscalapiService } from './fiscalapi-service.interface';
import { Person } from '../models/person';

/**
 * Interfaz del servicio de personas
 */
export interface IPersonService extends IFiscalapiService<Person> {
  // Aquí irían métodos específicos para personas
}