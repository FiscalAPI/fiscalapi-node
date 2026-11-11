import { IFiscalapiService } from './fiscalapi-service.interface';
import { IEmployeeService } from './employee-service.interface';
import { IEmployerService } from './employer-service.interface';
import { Person, PersonListFilters } from '../models/person';
import { TaxFile } from '../models/tax-file';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';

/**
 * Interfaz del servicio de personas
 */
export interface IPersonService extends IFiscalapiService<Person> {
  readonly employee: IEmployeeService;
  readonly employer: IEmployerService;

  /**
   * GET /api/v4/people?PageNumber=…&PageSize=…
   * Recupera una página de personas, sin filtros.
   * @param {number} pageNumber - Número de página (base 1)
   * @param {number} pageSize - Número de elementos por página
   * @returns {Promise<ApiResponse<PagedList<Person>>>} Página de personas
   */
  getList(pageNumber: number, pageSize: number): Promise<ApiResponse<PagedList<Person>>>;

  /**
   * GET /api/v4/people
   * Lista las personas del tenant con los filtros asignados (sin filtros: la lista de siempre, primera página).
   * @param {PersonListFilters} [filters] - Filtros de la consulta
   * @returns {Promise<ApiResponse<PagedList<Person>>>} Página de personas
   */
  getList(filters?: PersonListFilters): Promise<ApiResponse<PagedList<Person>>>;

  /**
   * GET /api/v4/people/{id}
   * Obtiene una persona por su id.
   * @param {string} id - Id de la persona
   * @returns {Promise<ApiResponse<Person>>} Persona
   */
  getById(id: string): Promise<ApiResponse<Person>>;

  /**
   * GET /api/v4/people/{id}
   * Obtiene una persona por su id.
   * @deprecated `details` no tiene efecto en personas: el API responde la misma persona con cualquier valor. Se
   * conserva para no romper la compilación; usa `getById(id)`.
   * @param {string} id - Id de la persona
   * @param {boolean} [details=false] - Obsoleto y sin efecto en personas
   * @returns {Promise<ApiResponse<Person>>} Persona
   */
  getById(id: string, details?: boolean): Promise<ApiResponse<Person>>;

  /**
   * Lista los certificados (CSD y FIEL) de una persona, solo metadatos, sin el archivo ni la contraseña.
   */
  getTaxFiles(personId: string): Promise<ApiResponse<TaxFile[]>>;
}
