import {DateTime} from 'luxon';
import { AuditableDto } from "./auditable-dto";

/**
 * Clase base para todos los DTOs de la API
 */
export class BaseDto extends AuditableDto {
    id?: string;
}
