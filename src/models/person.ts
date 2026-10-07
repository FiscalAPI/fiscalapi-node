 
// src/models/person.ts
import { BaseDto } from '../common/base-dto';
import { CatalogDto } from '../common/catalog-dto';
import type { CreditType } from './stamp';

/**
 * Modelo persona
 * Contiene toda la información de una persona emisor o receptor
 */
export interface Person extends BaseDto {
  /** Razón social de la persona sin régimen de capital */
  legalName?: string;

  /** Correo electrónico de la persona */
  email?: string;

  /** Contraseña para acceder al dashboard. Requerida al crear; al actualizar, null o vacía conserva la actual. El API nunca la devuelve */
  password?: string;

  /** Teléfono de la persona */
  phoneNumber?: string;

  /**
   * @deprecated El API no tiene régimen de capital: ignora el valor y nunca lo devuelve.
   * Envíe la razón social sin régimen de capital en legalName.
   */
  capitalRegime?: string;

  /** Código del régimen fiscal del emisor. Catálogo del SAT c_régimenFiscal. Valores: "601", "603", "605" */
  satTaxRegimeId?: string;

  /** Código del régimen fiscal del emisor expandido */
  satTaxRegime?: CatalogDto;

  /** Código de uso del CFDI por defecto cuando este emisor actúe como receptor. Catálogo del SAT c_UsoCFDI. Valores: "G01", "G02", "G03" */
  satCfdiUseId?: string;

  /** Código de uso del CFDI por defecto expandido */
  satCfdiUse?: CatalogDto;

  /**
   * Tipo de persona, solo tiene fines informativos. Valores: "C" (cliente, por omisión al crear) o "U" (usuario).
   * "T" (tenant) solo llega en respuestas: el API lo rechaza al crear y al actualizar solo lo acepta si la persona ya es "T".
   */
  userTypeId?: string;

  /** Tipo de persona expandido */
  userType?: CatalogDto;

  /** RFC del emisor (Tax Identification Number) */
  tin?: string;

  /** CURP de la persona. Utilizado en el CFDI de nómina */
  curp?: string;

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

  /** Saldo de créditos de validación del SAT. Independiente de availableBalance (timbres). Atributo de sólo lectura */
  availableValidationBalance?: number;

  /** Saldos por tipo de crédito. Solo aparecen los tipos que la persona ha tenido. Atributo de sólo lectura */
  balances?: CreditBalance[];

  /** ID del tenant al que pertenece el emisor. Atributo de sólo lectura */
  tenantId?: string;

  /** true si la persona es el owner de su tenant. Atributo de sólo lectura */
  isOwner?: boolean;

  /** Clave del país de residencia fiscal del receptor extranjero. Catálogo SAT c_Pais */
  countryId?: string;

  /** País de residencia fiscal expandido. Atributo de sólo lectura */
  country?: CatalogDto;

  /** Número de registro de identificación tributaria del receptor extranjero */
  foreignTin?: string;
}

/**
 * Saldo de una persona para un tipo de crédito (Person.balances).
 * Un tipo ausente tiene saldo 0; un tipo que este SDK no conoce conserva su número en creditType.
 */
export interface CreditBalance {
  /** Tipo de crédito: 1 timbres, 2 créditos de validación */
  creditType: CreditType;

  /** Saldo disponible */
  available: number;
}