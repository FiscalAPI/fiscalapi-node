 
// src/models/person.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo de persona
 */
export class Person extends BaseDto {
  /** Razón social o nombre legal */
  legalName?: string;
  
  /** Nombre comercial */
  commercialName?: string;
  
  /** RFC (Registro Federal de Contribuyentes) */
  tin?: string;
  
  /** Correo electrónico */
  email?: string;
  
  /** Teléfono */
  phone?: string;
  
  /** Código postal */
  zipCode?: string;
  
  /** Dirección */
  address?: string;
  
  /** Código de régimen fiscal */
  taxRegimeCode?: string;
  
  /** Código de tipo de persona (física o moral) */
  personTypeCode?: string;
  
  /** Código de país */
  countryCode?: string;
  
  /** Código de estado */
  stateCode?: string;
  
  /** Nombre de la ciudad */
  cityName?: string;
}