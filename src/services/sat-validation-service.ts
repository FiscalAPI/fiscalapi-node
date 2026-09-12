import { ApiResponse } from '../common/api-response';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ISatValidationService } from '../abstractions/sat-validation-service.interface';
import {
  SatValidationRequest,
  SatValidationResult,
  SatValidationType,
  SatValidationTypeStatus,
} from '../models/sat-validation';

/**
 * Implementación del servicio de validaciones del SAT
 */
export class SatValidationService implements ISatValidationService {
  /** Cliente HTTP */
  private readonly httpClient: IFiscalapiHttpClient;

  /** Ruta base del recurso */
  private readonly baseEndpoint: string;

  /**
   * Crea una nueva instancia del servicio de validaciones del SAT
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string = 'v4') {
    if (!httpClient) throw new Error('httpClient no puede ser nulo o indefinido');
    if (!apiVersion) throw new Error('apiVersion no puede ser nulo o indefinido');

    this.httpClient = httpClient;
    this.baseEndpoint = `api/${apiVersion}/sat-validations`;
  }

  /**
   * Construye el endpoint completo para las peticiones
   * @param {string} [path] - Ruta adicional opcional
   * @returns {string} URL completa del endpoint
   * @private
   */
  private buildEndpoint(path?: string): string {
    return path ? `${this.baseEndpoint}/${path}` : this.baseEndpoint;
  }

  /**
   * @inheritdoc
   */
  async getTypes(): Promise<ApiResponse<SatValidationType[]>> {
    // GET /api/v4/sat-validations
    const endpoint = this.buildEndpoint();
    return this.httpClient.getAsync<SatValidationType[]>(endpoint);
  }

  /**
   * @inheritdoc
   */
  async getTypeById(id: string): Promise<ApiResponse<SatValidationType>> {
    if (!id || id.trim() === '') {
      throw new Error('id cannot be null or empty');
    }

    // GET /api/v4/sat-validations/{id}
    // El id lleva puntos (sat.cfdi.status) y viaja tal cual: no se codifica ni se recorta.
    const endpoint = this.buildEndpoint(id);
    return this.httpClient.getAsync<SatValidationType>(endpoint);
  }

  /**
   * @inheritdoc
   */
  async getStatuses(id: string): Promise<ApiResponse<SatValidationTypeStatus[]>> {
    if (!id || id.trim() === '') {
      throw new Error('id cannot be null or empty');
    }

    // GET /api/v4/sat-validations/{id}/statuses
    const endpoint = this.buildEndpoint(`${id}/statuses`);
    return this.httpClient.getAsync<SatValidationTypeStatus[]>(endpoint);
  }

  /**
   * @inheritdoc
   */
  async validate(request: SatValidationRequest): Promise<ApiResponse<SatValidationResult[]>> {
    if (!request) {
      throw new Error('request cannot be null');
    }

    // POST /api/v4/sat-validations
    const endpoint = this.buildEndpoint();
    return this.httpClient.postAsync<SatValidationResult[], SatValidationRequest>(endpoint, request);
  }
}
