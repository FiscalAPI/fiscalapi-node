
import { Person, PersonListFilters } from '../models/person';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IPersonService } from '../abstractions/person-service.interface';
import { IEmployeeService } from '../abstractions/employee-service.interface';
import { IEmployerService } from '../abstractions/employer-service.interface';
import { EmployeeService } from './employee-service';
import { EmployerService } from './employer-service';
import { TaxFile } from '../models/tax-file';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { isListFilters, toQueryString } from '../utils/list-query';

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

  /**
   * @inheritdoc
   */
  getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<Person>>>;
  /**
   * @inheritdoc
   */
  getList(filters?: PersonListFilters): Promise<ApiResponse<PagedList<Person>>>;
  async getList(
    pageNumberOrFilters?: number | PersonListFilters,
    pageSize?: number,
  ): Promise<ApiResponse<PagedList<Person>>> {
    if (isListFilters(pageNumberOrFilters)) {
      // GET /api/v4/people?search=…&userTypeId=…&pageNumber=…&pageSize=…
      return this.getFilteredList(buildListQuery(pageNumberOrFilters ?? {}));
    }
    return super.getList(pageNumberOrFilters, pageSize as number);
  }

  /**
   * Lista los certificados (CSD y FIEL) de una persona, solo metadatos, sin el archivo ni la contraseña.
   * @param {string} personId - Id de la persona propietaria de los certificados
   * @returns {Promise<ApiResponse<TaxFile[]>>} Lista de certificados sin `base64File` ni `password`
   */
  async getTaxFiles(personId: string): Promise<ApiResponse<TaxFile[]>> {
    const endpoint = this.buildEndpoint(`${personId}/tax-files`);
    return this.httpClient.getAsync<TaxFile[]>(endpoint);
  }
}

/**
 * Query string de los filtros asignados, sin el signo `?`.
 * @param {PersonListFilters} filters - Filtros de la lista
 * @returns {string} Query string, vacía si no hay filtros
 */
function buildListQuery(filters: PersonListFilters): string {
  return toQueryString([
    ['search', filters.search],
    ['userTypeId', filters.userTypeId],
    ['pageNumber', filters.pageNumber],
    ['pageSize', filters.pageSize],
  ]);
}
