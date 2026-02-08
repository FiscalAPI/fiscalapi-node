// src/models/stamp.ts
import { BaseDto } from '../common/base-dto';

/**
 * Tipo de transacción de timbres
 */
export enum StampTransactionType {
  Purchase = 1,
  Transfer = 2,
  Consumption = 3,
  AutoInvoice = 4,
  Rollback = 5,
}

/**
 * Estado de transacción de timbres
 */
export enum StampTransactionStatus {
  Completed = 1,
  Cancelled = 2,
  RolledBack = 3,
}

/**
 * DTO para información resumida de persona en transacciones de timbres
 */
export interface UserLookupDto extends BaseDto {
  /** RFC de la persona (Tax Identification Number) */
  tin?: string;

  /** Razón social de la persona */
  legalName?: string;
}

/**
 * Representa una transacción de timbres fiscales
 */
export interface StampTransaction extends BaseDto {
  /** Número consecutivo de la transacción */
  consecutive?: number;

  /** Persona origen de la transferencia */
  fromPerson?: UserLookupDto;

  /** Persona destino de la transferencia */
  toPerson?: UserLookupDto;

  /** Cantidad de timbres en la transacción */
  amount?: number;

  /** Tipo de transacción */
  transactionType?: StampTransactionType;

  /** Estado de la transacción */
  transactionStatus?: StampTransactionStatus;

  /** ID de referencia de la transacción */
  referenceId?: string;

  /** Comentarios de la transacción */
  comments?: string;
}

/**
 * Parámetros para realizar una transferencia o retiro de timbres
 */
export interface StampTransactionParams {
  /** ID de la persona origen */
  fromPersonId: string;

  /** ID de la persona destino */
  toPersonId: string;

  /** Cantidad de timbres a transferir */
  amount: number;

  /** Comentarios opcionales */
  comments?: string;
}
