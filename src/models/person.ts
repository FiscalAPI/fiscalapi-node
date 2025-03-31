 
// src/models/person.ts
import { BaseDto } from '../common/base-dto';
import { CatalogDto } from '../common/catalog-dto';

/**
 * Modelo persona
 * Contiene toda la información de una persona emisor o receptor
 */
export interface Person extends BaseDto {
  /** Razón social de la persona sin régimen de capital */
  legalName?: string;

  /** Correo electrónico de la persona */
  email?: string;

  /** Contraseña para acceder al dashboard */
  password?: string;

  /** Régimen de capital de la persona */
  capitalRegime?: string;

  /** Código del régimen fiscal del emisor. Catálogo del SAT c_régimenFiscal. Valores: "601", "603", "605" */
  satTaxRegimeId?: string;

  /** Código del régimen fiscal del emisor expandido */
  satTaxRegime?: CatalogDto;

  /** Código de uso del CFDI por defecto cuando este emisor actúe como receptor. Catálogo del SAT c_UsoCFDI. Valores: "G01", "G02", "G03" */
  satCfdiUseId?: string;

  /** Código de uso del CFDI por defecto expandido */
  satCfdiUse?: CatalogDto;

  /** Tipo de persona, solo tiene fines informativos. Valores: "T", "C", "U" */
  userTypeId?: string;

  /** Tipo de persona expandido */
  userType?: CatalogDto;

  /** RFC del emisor (Tax Identification Number) */
  tin?: string;

  /** Código postal del emisor. Catálogo del SAT c_CodigoPostal */
  zipCode?: string;

  /** Foto de perfil del emisor en formato base64 */
  base64Photo?: string;

  /** Contraseña de los certificados CSD cuando es un emisor */
  taxPassword?: string;

  /** Saldo disponible en la cuenta del emisor. Atributo de sólo lectura */
  availableBalance?: number;

  /** Saldo en tránsito. Atributo de sólo lectura */
  committedBalance?: number;

  /** ID del tenant al que pertenece el emisor. Atributo de sólo lectura */
  tenantId?: string;
}