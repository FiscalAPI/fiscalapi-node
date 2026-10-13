import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { Ticket, TicketCodeResult, TicketIngestionResult, TicketListFilters } from '../models/ticket';

/**
 * Interfaz del servicio de tickets de Auto CFDI: ingesta de ventas pagadas del punto de venta, consulta con filtros,
 * código para reimprimir y cancelación. No extiende `IFiscalapiService`: la ingesta responde otra forma que el ticket
 * y no hay actualización.
 */
export interface ITicketService {
  /**
   * POST /api/v4/tickets
   * Ingiere un ticket y cobra 1 crédito de ticket. Con `idempotencyKey` (hasta 64 caracteres) se envía el header
   * `Idempotency-Key`: repetir la key con el mismo cuerpo responde 200 con el ticket original sin cobrar otra vez; con
   * otro cuerpo, 422. Sin ella, el header no se envía. Un folio y serie ya activos del emisor responden 409.
   * @param {Ticket} ticket - Ticket a ingerir
   * @param {string} [idempotencyKey] - Valor del header Idempotency-Key
   * @returns {Promise<ApiResponse<TicketIngestionResult>>} Ticket ingerido con su código y QR
   */
  create(ticket: Ticket, idempotencyKey?: string): Promise<ApiResponse<TicketIngestionResult>>;

  /**
   * GET /api/v4/tickets
   * Lista los tickets del tenant con los filtros asignados (sin filtros: todos, primera página).
   * @param {TicketListFilters} [filters] - Filtros de la consulta
   * @returns {Promise<ApiResponse<PagedList<Ticket>>>} Página de tickets
   */
  getList(filters?: TicketListFilters): Promise<ApiResponse<PagedList<Ticket>>>;

  /**
   * GET /api/v4/tickets/{id}?details=true
   * Obtiene un ticket; con `details` trae también sus conceptos e historia.
   * @param {string} id - Id del ticket
   * @param {boolean} [details=false] - Incluir conceptos e historia
   * @returns {Promise<ApiResponse<Ticket>>} Ticket
   */
  getById(id: string, details?: boolean): Promise<ApiResponse<Ticket>>;

  /**
   * GET /api/v4/tickets/{id}/code
   * Obtiene el código del ticket y la URL de su QR, para reimprimirlo.
   * @param {string} id - Id del ticket
   * @returns {Promise<ApiResponse<TicketCodeResult>>} Código y URL del QR
   */
  getCode(id: string): Promise<ApiResponse<TicketCodeResult>>;

  /**
   * DELETE /api/v4/tickets/{id}
   * Cancela un ticket en estado pending (409 en cualquier otro estado); el crédito de ticket no se devuelve.
   * @param {string} id - Id del ticket
   * @returns {Promise<ApiResponse<boolean>>} true si se canceló
   */
  cancel(id: string): Promise<ApiResponse<boolean>>;
}
