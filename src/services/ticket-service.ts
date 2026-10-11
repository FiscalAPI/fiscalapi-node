import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ITicketService } from '../abstractions/ticket-service.interface';
import { Ticket, TicketCodeResult, TicketIngestionResult, TicketListFilters } from '../models/ticket';

/** Header de la ingesta idempotente. */
const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';

/**
 * Implementación del servicio de tickets de Auto CFDI
 */
export class TicketService implements ITicketService {
  /** Cliente HTTP */
  private readonly httpClient: IFiscalapiHttpClient;

  /** Ruta base del recurso */
  private readonly baseEndpoint: string;

  /**
   * Crea una nueva instancia del servicio de tickets
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string = 'v4') {
    if (!httpClient) throw new Error('httpClient no puede ser nulo o indefinido');
    if (!apiVersion) throw new Error('apiVersion no puede ser nulo o indefinido');

    this.httpClient = httpClient;
    this.baseEndpoint = `api/${apiVersion}/tickets`;
  }

  /**
   * @inheritdoc
   */
  async create(ticket: Ticket, idempotencyKey?: string): Promise<ApiResponse<TicketIngestionResult>> {
    if (!ticket) {
      throw new Error('ticket cannot be null');
    }

    // POST /api/v4/tickets, con el header Idempotency-Key solo si se pasa
    const config: AxiosRequestConfig | undefined =
      idempotencyKey === undefined ? undefined : { headers: { [IDEMPOTENCY_KEY_HEADER]: idempotencyKey } };
    return this.httpClient.postAsync<TicketIngestionResult, Ticket>(this.baseEndpoint, ticket, config);
  }

  /**
   * @inheritdoc
   */
  async getList(filters: TicketListFilters = {}): Promise<ApiResponse<PagedList<Ticket>>> {
    // GET /api/v4/tickets?status=pending&status=invoiced&personId=…&from=…&to=…&pageNumber=…&pageSize=…
    const query = buildListQuery(filters);
    const endpoint = query ? `${this.baseEndpoint}?${query}` : this.baseEndpoint;
    return this.httpClient.getAsync<PagedList<Ticket>>(endpoint);
  }

  /**
   * @inheritdoc
   */
  async getById(id: string, details: boolean = false): Promise<ApiResponse<Ticket>> {
    ensureId(id);

    // GET /api/v4/tickets/{id}; ?details=true solo si se piden, como getById de los demás servicios
    const endpoint = `${this.baseEndpoint}/${id}${details ? '?details=true' : ''}`;
    return this.httpClient.getAsync<Ticket>(endpoint);
  }

  /**
   * @inheritdoc
   */
  async getCode(id: string): Promise<ApiResponse<TicketCodeResult>> {
    ensureId(id);

    // GET /api/v4/tickets/{id}/code
    return this.httpClient.getAsync<TicketCodeResult>(`${this.baseEndpoint}/${id}/code`);
  }

  /**
   * @inheritdoc
   */
  async cancel(id: string): Promise<ApiResponse<boolean>> {
    ensureId(id);

    // DELETE /api/v4/tickets/{id}
    return this.httpClient.deleteAsync(`${this.baseEndpoint}/${id}`);
  }
}

/**
 * Sin id, la ruta sería la de la lista (GET) o la colección (DELETE): se rechaza antes de llamar al API.
 * @param {string} id - Id del ticket
 */
function ensureId(id: string): void {
  if (!id || id.trim() === '') {
    throw new Error('id cannot be null or empty');
  }
}

/**
 * Query string de los filtros asignados, sin el signo `?`; `status` se repite por cada estado. Se arma aquí porque
 * axios serializa los arreglos como `status[]=…`, que el API no lee.
 * @param {TicketListFilters} filters - Filtros de la lista
 * @returns {string} Query string, vacía si no hay filtros
 */
function buildListQuery(filters: TicketListFilters): string {
  const pairs: Array<[string, string]> = (filters.status ?? []).map((status): [string, string] => ['status', status]);
  const optional: Array<[string, string | number | undefined]> = [
    ['personId', filters.personId],
    ['from', filters.from],
    ['to', filters.to],
    ['pageNumber', filters.pageNumber],
    ['pageSize', filters.pageSize],
  ];
  optional.forEach(([key, value]) => {
    if (value !== undefined) {
      pairs.push([key, String(value)]);
    }
  });

  return pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}
