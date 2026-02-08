
import { Person } from '../models/person';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IPersonService } from '../abstractions/person-service.interface';
import { IEmployeeService } from '../abstractions/employee-service.interface';
import { IEmployerService } from '../abstractions/employer-service.interface';
import { EmployeeService } from './employee-service';
import { EmployerService } from './employer-service';

/**
 * Implementación del servicio de personas
 */
export class PersonService extends BaseFiscalapiService<Person> implements IPersonService {
  readonly employee: IEmployeeService;
  readonly employer: IEmployerService;

  /**
   * Crea una nueva instancia del servicio de personas
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'people', apiVersion);
    this.employee = new EmployeeService(httpClient, apiVersion);
    this.employer = new EmployerService(httpClient, apiVersion);
  }
}
