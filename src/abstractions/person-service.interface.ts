
import { IFiscalapiService } from './fiscalapi-service.interface';
import { IEmployeeService } from './employee-service.interface';
import { IEmployerService } from './employer-service.interface';
import { Person } from '../models/person';

/**
 * Interfaz del servicio de personas
 */
export interface IPersonService extends IFiscalapiService<Person> {
  readonly employee: IEmployeeService;
  readonly employer: IEmployerService;
}
