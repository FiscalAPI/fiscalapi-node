import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ApiResponse } from '../common/api-response';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IStampService } from '../abstractions/stamp-service.interface';
import { StampTransaction, StampTransactionParams } from '../models/stamp';

/**
 * Implementación del servicio de timbres fiscales
 */
export class StampService extends BaseFiscalapiService<StampTransaction> implements IStampService {
  /**
   * Crea una nueva instancia del servicio de timbres
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'stamps', apiVersion);
  }

  /**
   * Transfiere timbres de una persona a otra
   * @param {StampTransactionParams} request - Parámetros de la transferencia
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  async transferStamps(request: StampTransactionParams): Promise<ApiResponse<boolean>> {
    if (!request) {
      throw new Error('request cannot be null');
    }

    return await this.executeRequest<boolean, StampTransactionParams>({
      data: request,
      method: 'POST',
    });
  }

  /**
   * Retira timbres de una persona
   * @param {StampTransactionParams} request - Parámetros del retiro
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  async withdrawStamps(request: StampTransactionParams): Promise<ApiResponse<boolean>> {
    if (!request) {
      throw new Error('request cannot be null');
    }

    return await this.executeRequest<boolean, StampTransactionParams>({
      data: request,
      method: 'POST',
    });
  }
}
