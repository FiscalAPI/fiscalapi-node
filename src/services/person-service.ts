
import { Person } from '../models/person';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IPersonService } from '..';

/**
 * Implementación del servicio de personas
 */
export class PersonService extends BaseFiscalapiService<Person> implements IPersonService {
  /**
   * Crea una nueva instancia del servicio de personas
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'persons', apiVersion);
  }
}
