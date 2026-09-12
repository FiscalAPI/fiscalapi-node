import { ApiResponse } from '../common/api-response';
import {
  SatValidationRequest,
  SatValidationResult,
  SatValidationType,
  SatValidationTypeStatus,
} from '../models/sat-validation';

/**
 * Interfaz del servicio de validaciones del SAT.
 *
 * El recurso es de sólo lectura salvo por `validate`, que ejecuta las validaciones solicitadas
 * y cobra un crédito de validación por cada tipo. Por eso no extiende `IFiscalapiService`:
 * no aplica ninguna operación CRUD ni paginación.
 */
export interface ISatValidationService {
  /**
   * GET /api/v4/sat-validations
   * Recupera los tipos de validación disponibles, en el orden del catálogo.
   * @returns {Promise<ApiResponse<SatValidationType[]>>} Lista de tipos de validación
   */
  getTypes(): Promise<ApiResponse<SatValidationType[]>>;

  /**
   * GET /api/v4/sat-validations/{id}
   * Recupera un tipo de validación por su id.
   * @param {string} id - Id del tipo de validación. Ej. "sat.cfdi.status"
   * @returns {Promise<ApiResponse<SatValidationType>>} Tipo de validación
   */
  getTypeById(id: string): Promise<ApiResponse<SatValidationType>>;

  /**
   * GET /api/v4/sat-validations/{id}/statuses
   * Recupera los estatus que un tipo de validación puede tomar al ejecutarse, con los
   * aprobatorios primero. Es de sólo lectura: no ejecuta el validador ni consume crédito.
   * @param {string} id - Id del tipo de validación. Ej. "sat.cfdi.status"
   * @returns {Promise<ApiResponse<SatValidationTypeStatus[]>>} Estatus posibles del tipo
   */
  getStatuses(id: string): Promise<ApiResponse<SatValidationTypeStatus[]>>;

  /**
   * POST /api/v4/sat-validations
   * Ejecuta las validaciones solicitadas sobre un CFDI (`xml`) o sobre un RFC (`tin`).
   *
   * Cada tipo solicitado consume un crédito de validación. El cobro es todo o nada y ocurre
   * antes de ejecutar: si el saldo no alcanza para todos, no se ejecuta ninguno y la respuesta
   * es 403. Los resultados vienen en el orden del catálogo, no en el orden solicitado.
   *
   * Un resultado adverso de negocio (por ejemplo un CFDI cancelado) sigue siendo 200 con
   * `succeeded: true`; lo que indica el veredicto es `passed` de cada elemento.
   *
   * @param {SatValidationRequest} request - Parámetros de la ejecución
   * @returns {Promise<ApiResponse<SatValidationResult[]>>} Un resultado por tipo ejecutado
   */
  validate(request: SatValidationRequest): Promise<ApiResponse<SatValidationResult[]>>;
}
