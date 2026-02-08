import { BaseDto } from '../common/base-dto';
import { CatalogDto } from '../common/catalog-dto';

/**
 * Datos de empleado (response model)
 */
export interface EmployeeData extends BaseDto  {
  employerPersonId?: string;
  employeePersonId?: string;
  employeeNumber?: string;
  socialSecurityNumber?: string;
  laborRelationStartDate?: string;
  satContractType?: CatalogDto;
  satTaxRegimeType?: CatalogDto;
  satWorkdayType?: CatalogDto;
  satJobRisk?: CatalogDto;
  satPaymentPeriodicity?: CatalogDto;
  satBank?: CatalogDto;
  satPayrollState?: CatalogDto;
  satUnionizedStatus?: CatalogDto;
  department?: string;
  position?: string;
  seniority?: string;
  bankAccount?: string;
  baseSalaryForContributions?: number;
  integratedDailySalary?: number;
  subcontractorRfc?: string;
  timePercentage?: number;
}

/**
 * Request para crear datos de empleado
 */
export interface CreateEmployeeRequest {
  employerPersonId: string;
  employeePersonId: string;
  employeeNumber?: string;
  satContractTypeId?: string;
  satTaxRegimeTypeId?: string;
  satPaymentPeriodicityId?: string;
  satPayrollStateId?: string;
  socialSecurityNumber?: string;
  laborRelationStartDate?: string;
  satWorkdayTypeId?: string;
  satJobRiskId?: string;
  satBankId?: string;
  satUnionizedStatusId?: string;
  department?: string;
  position?: string;
  seniority?: string;
  bankAccount?: string;
  baseSalaryForContributions?: number;
  integratedDailySalary?: number;
  subcontractorRfc?: string;
  timePercentage?: number;
}

/**
 * Request para actualizar datos de empleado
 */
export interface UpdateEmployeeRequest extends CreateEmployeeRequest {}
