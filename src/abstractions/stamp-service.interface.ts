import { ApiResponse } from '../common/api-response';
import { StampTransaction, StampTransactionParams } from '../models/stamp';
import { IFiscalapiService } from './fiscalapi-service.interface';

/**
 * Interfaz para el servicio de timbres fiscales
 */
export interface IStampService extends IFiscalapiService<StampTransaction> {
  /**
   * POST /api/v4/stamps
   * Transfiere timbres de una persona a otra. Con `idempotencyKey` (hasta 64 caracteres) se envía el header
   * `Idempotency-Key`: repetir la llave de idempotencia con la misma petición devuelve el resultado original sin transferir otra vez;
   * con otra petición, 422. Sin ella, el header no se envía.
   * @param {StampTransactionParams} request - Parámetros de la transferencia
   * @param {string} [idempotencyKey] - Valor del header Idempotency-Key
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  transferStamps(request: StampTransactionParams, idempotencyKey?: string): Promise<ApiResponse<boolean>>;

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
