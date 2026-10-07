import { BaseDto } from '../common/base-dto';
import { ApiResponse } from '../common/api-response';
import { IFiscalapiService } from '../abstractions/fiscalapi-service.interface';
import { BaseImmutableFiscalapiService } from './base-immutable-fiscalapi-service';

/**
 * Implementación base de un servicio de FiscalAPI
 * @template T - Tipo de DTO que maneja el servicio
 */
export abstract class BaseFiscalapiService<T extends BaseDto> extends BaseImmutableFiscalapiService<T> implements IFiscalapiService<T> {
  /**
   * @inheritdoc
   */
  async update(model: T): Promise<ApiResponse<T>> {
    return this.executeRequest<T, T>({
      method: 'PUT',
      id: model.id,
      data: model
    });
  }
}