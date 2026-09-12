import { ApiResponse } from '../common/api-response';
import { StampTransaction, StampTransactionParams } from '../models/stamp';
import { IFiscalapiService } from './fiscalapi-service.interface';

/**
 * Interfaz para el servicio de timbres fiscales
 */
export interface IStampService extends IFiscalapiService<StampTransaction> {
  /**
   * Transfiere timbres de una persona a otra
   * @param {StampTransactionParams} request - Parámetros de la transferencia
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  transferStamps(request: StampTransactionParams): Promise<ApiResponse<boolean>>;

  /**
   * Retira timbres de una persona
   *
   * @deprecated Usa {@link transferStamps}. La API sólo expone una operación de transferencia:
   * retirar es transferir invirtiendo `fromPersonId` y `toPersonId`. Este método hace exactamente
   * la misma petición y se conserva únicamente por compatibilidad.
   *
   * @param {StampTransactionParams} request - Parámetros del retiro
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  withdrawStamps(request: StampTransactionParams): Promise<ApiResponse<boolean>>;
}
