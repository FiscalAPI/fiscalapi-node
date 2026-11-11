
import { IFiscalapiService } from './fiscalapi-service.interface';
import { IEmployeeService } from './employee-service.interface';
import { IEmployerService } from './employer-service.interface';
import { Person } from '../models/person';
import { TaxFile } from '../models/tax-file';
import { ApiResponse } from '../common/api-response';

/**
 * Interfaz del servicio de personas
 */
export interface IPersonService extends IFiscalapiService<Person> {
  readonly employee: IEmployeeService;
  readonly employer: IEmployerService;

  /**
   * Lista los certificados (CSD y FIEL) de una persona, solo metadatos, sin el archivo ni la contraseña.
   */
  getTaxFiles(personId: string): Promise<ApiResponse<TaxFile[]>>;
}
