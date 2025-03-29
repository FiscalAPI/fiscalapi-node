 
import { DateTime } from 'luxon';
import { SerializableDto } from './serializable-dto';

/**
 * Clase que extiende SerializableDto agregando propiedades de auditoría
 */
export class AuditableDto extends SerializableDto {
  createdAt?: DateTime;
  updatedAt?: DateTime;
}