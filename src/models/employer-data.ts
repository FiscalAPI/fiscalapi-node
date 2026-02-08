import { BaseDto } from '../common/base-dto';
import { CatalogDto } from '../common/catalog-dto';

/**
 * Datos de empleador (response model)
 * Extiende BaseDto porque la respuesta incluye id/createdAt/updatedAt
 */
export interface EmployerData extends BaseDto {
  personId?: string;
  employerRegistration?: string;
  originEmployerTin?: string;
  satFundSource?: CatalogDto;
  ownResourceAmount?: number;
}

/**
 * Request para crear datos de empleador
 */
export interface CreateEmployerRequest {
  personId: string;
  employerRegistration?: string;
  originEmployerTin?: string;
  satFundSourceId?: string;
  ownResourceAmount?: number;
}

/**
 * Request para actualizar datos de empleador
 */
export interface UpdateEmployerRequest extends CreateEmployerRequest {}
