/**
 * Ejemplos de facturas de nómina (CFDI Nómina) usando el SDK de FiscalAPI
 * Todos los métodos usan el modo "ByReferences" - se pasan solo IDs de entidades preconfiguradas
 */

import {
  FiscalapiClient,
  FiscalapiSettings,
  Invoice,
  CreateEmployerRequest,
  CreateEmployeeRequest
} from '../src/index';
import { inspect } from 'util';

// Configuración de la consola para mostrar objetos anidados
inspect.defaultOptions.depth = null;
inspect.defaultOptions.colors = true;

// Configuración de FiscalAPI
const settings: FiscalapiSettings = {
    apiUrl: 'https://test.fisalapi.com',
    apiKey: '<API_KEY>',
    tenant: '<TENANT_ID>',
    debug: true

   
};

// ============================================================================
// UUID CONSTANTS - IDs de personas preconfiguradas en FiscalAPI
// ============================================================================
const escuelaKemperUrgateId = "2e7b988f-3a2a-4f67-86e9-3f931dd48581";
const karlaFuenteNolascoId = "109f4d94-63ea-4a21-ab15-20c8b87d8ee9";
const organicosNavezOsorioId = "f645e146-f80e-40fa-953f-fd1bd06d4e9f";
const xochiltCasasChavezId = "e3b4edaa-e4d9-4794-9c5b-3dd5b7e372aa";
const ingridXodarJimenezId = "9367249f-f0ee-43f4-b771-da2fff3f185f";

// Fecha actual para las facturas
const currentDate = '2026-01-27T10:04:06';

// ============================================================================
// 1. NOMINA ORDINARIA (Facturación por referencias)
// ============================================================================
async function nominaOrdinariaByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Ordinaria ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(karlaFuenteNolascoId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: karlaFuenteNolascoId,
    socialSecurityNumber: '04078873454',
    laborRelationStartDate: '2024-08-18',
    seniority: 'P54W',
    satContractTypeId: '01',
    satTaxRegimeTypeId: '02',
    employeeNumber: '123456789',
    department: 'GenAI',
    position: 'Sr Software Engineer',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '05',
    satBankId: '012',
    baseSalaryForContributions: 2828.50,
    integratedDailySalary: 0.00,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaOrdinariaByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Ordinaria ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: karlaFuenteNolascoId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2025-08-30',
        initialPaymentDate: '2025-07-31',
        finalPaymentDate: '2025-08-30',
        daysPaid: 30,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: '1003', concept: 'Sueldo Nominal', taxedAmount: 95030.00, exemptAmount: 0.00 },
            { earningTypeCode: '005', code: '5913', concept: 'Fondo de Ahorro Aportación Patrón', taxedAmount: 0.00, exemptAmount: 4412.46 },
            { earningTypeCode: '038', code: '1885', concept: 'Bono Ingles', taxedAmount: 14254.50, exemptAmount: 0.00 },
            { earningTypeCode: '029', code: '1941', concept: 'Vales Despensa', taxedAmount: 0.00, exemptAmount: 3439.00 },
            { earningTypeCode: '038', code: '1824', concept: 'Herramientas Teletrabajo (telecom y prop. electri)', taxedAmount: 273.00, exemptAmount: 0.00 }
          ],
          otherPayments: [
            { otherPaymentTypeCode: '002', code: '5050', concept: 'Exceso de subsidio al empleo', amount: 0.00, subsidyCaused: 0.00 }
          ]
        },
        deductions: [
          { deductionTypeCode: '002', code: '5003', concept: 'ISR Causado', amount: 27645.52 },
          { deductionTypeCode: '004', code: '5910', concept: 'Fondo de ahorro Empleado Inversión', amount: 4412.46 },
          { deductionTypeCode: '004', code: '5914', concept: 'Fondo de Ahorro Patrón Inversión', amount: 4412.46 },
          { deductionTypeCode: '004', code: '1966', concept: 'Contribución póliza exceso GMM', amount: 519.91 },
          { deductionTypeCode: '004', code: '1934', concept: 'Descuento Vales Despensa', amount: 1.00 },
          { deductionTypeCode: '004', code: '1942', concept: 'Vales Despensa Electrónico', amount: 3439.00 },
          { deductionTypeCode: '001', code: '1895', concept: 'IMSS', amount: 2391.13 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 2. NOMINA ASIMILADOS (Facturación por referencias)
// ============================================================================
async function nominaAsimiladosByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Asimilados ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(xochiltCasasChavezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    originEmployerTin: 'EKU9003173C9'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: xochiltCasasChavezId,
    satContractTypeId: '09',
    satUnionizedStatusId: 'No',
    satTaxRegimeTypeId: '09',
    employeeNumber: '00002',
    department: 'ADMINISTRACION',
    position: 'DIRECTOR DE ADMINISTRACION',
    satPaymentPeriodicityId: '99',
    satBankId: '012',
    bankAccount: '1111111111',
    satPayrollStateId: 'CMX'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaAsimiladosByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Asimilados ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '06880',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: xochiltCasasChavezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'E',
        paymentDate: '2023-06-02T00:00:00',
        initialPaymentDate: '2023-06-01T00:00:00',
        finalPaymentDate: '2023-06-02T00:00:00',
        daysPaid: 1,
        earnings: {
          earnings: [
            { earningTypeCode: '046', code: '010046', concept: 'INGRESOS ASIMILADOS A SALARIOS', taxedAmount: 111197.73, exemptAmount: 0.00 }
          ],
          otherPayments: []
        },
        deductions: [
          { deductionTypeCode: '002', code: '020002', concept: 'ISR', amount: 36197.73 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 3. NOMINA CON BONOS Y FONDO DE AHORRO (Facturación por referencias)
// ============================================================================
async function nominaConBonosFondoAhorroByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Con Bonos y Fondo de Ahorro ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'Z0000001234'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '0000000000',
    laborRelationStartDate: '2022-03-02T00:00:00',
    seniority: 'P66W',
    satContractTypeId: '01',
    satUnionizedStatusId: 'No',
    satTaxRegimeTypeId: '02',
    employeeNumber: '111111',
    satJobRiskId: '4',
    satPaymentPeriodicityId: '02',
    integratedDailySalary: 180.96,
    satPayrollStateId: 'GUA'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaConBonosFondoAhorroByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Con Bonos y Fondo de Ahorro ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-06-11T00:00:00',
        initialPaymentDate: '2023-06-05T00:00:00',
        finalPaymentDate: '2023-06-11T00:00:00',
        daysPaid: 7,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: 'SP01', concept: 'SUELDO', taxedAmount: 1210.30, exemptAmount: 0.00 },
            { earningTypeCode: '010', code: 'SP02', concept: 'PREMIO PUNTUALIDAD', taxedAmount: 121.03, exemptAmount: 0.00 },
            { earningTypeCode: '029', code: 'SP03', concept: 'MONEDERO ELECTRONICO', taxedAmount: 0.00, exemptAmount: 269.43 },
            { earningTypeCode: '010', code: 'SP04', concept: 'PREMIO DE ASISTENCIA', taxedAmount: 121.03, exemptAmount: 0.00 },
            { earningTypeCode: '005', code: 'SP54', concept: 'APORTACION FONDO AHORRO', taxedAmount: 0.00, exemptAmount: 121.03 }
          ],
          otherPayments: [
            {
              otherPaymentTypeCode: '002',
              code: 'ISRSUB',
              concept: 'Subsidio ISR para empleo',
              amount: 0.0,
              subsidyCaused: 0.0,
              balanceCompensation: {
                favorableBalance: 0.0,
                year: 2022,
                remainingFavorableBalance: 0.0
              }
            }
          ]
        },
        deductions: [
          { deductionTypeCode: '004', code: 'ZA09', concept: 'APORTACION FONDO AHORRO', amount: 121.03 },
          { deductionTypeCode: '002', code: 'ISR', concept: 'ISR', amount: 36.57 },
          { deductionTypeCode: '001', code: 'IMSS', concept: 'Cuota de Seguridad Social EE', amount: 30.08 },
          { deductionTypeCode: '004', code: 'ZA68', concept: 'DEDUCCION FDO AHORRO PAT', amount: 121.03 },
          { deductionTypeCode: '018', code: 'ZA11', concept: 'APORTACION CAJA AHORRO', amount: 300.00 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 4. NOMINA CON HORAS EXTRA (Facturación por referencias)
// ============================================================================
async function nominaConHorasExtraByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Con Horas Extra ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01',
    seniority: 'P437W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '04',
    satBankId: '002',
    bankAccount: '1111111111',
    baseSalaryForContributions: 490.22,
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaConHorasExtraByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Con Horas Extra ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-05-24T00:00:00',
        initialPaymentDate: '2023-05-09T00:00:00',
        finalPaymentDate: '2023-05-24T00:00:00',
        daysPaid: 15,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: '00500', concept: 'Sueldos, Salarios Rayas y Jornales', taxedAmount: 2808.8, exemptAmount: 2191.2 },
            {
              earningTypeCode: '019',
              code: '00100',
              concept: 'Horas Extra',
              taxedAmount: 50.00,
              exemptAmount: 50.00,
              overtime: [
                { days: 1, hoursTypeCode: '01', extraHours: 2, amountPaid: 100.00 }
              ]
            }
          ],
          otherPayments: []
        },
        deductions: [
          { deductionTypeCode: '001', code: '00301', concept: 'Seguridad Social', amount: 200 },
          { deductionTypeCode: '002', code: '00302', concept: 'ISR', amount: 100 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 5. NOMINA CON INCAPACIDADES (Facturación por referencias)
// ============================================================================
async function nominaConIncapacidadesByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Con Incapacidades ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01T00:00:00',
    seniority: 'P437W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '04',
    satBankId: '002',
    bankAccount: '1111111111',
    baseSalaryForContributions: 490.22,
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaConIncapacidadesByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Con Incapacidades ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-05-24T00:00:00',
        initialPaymentDate: '2023-05-09T00:00:00',
        finalPaymentDate: '2023-05-24T00:00:00',
        daysPaid: 15,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: '00500', concept: 'Sueldos, Salarios Rayas y Jornales', taxedAmount: 2808.8, exemptAmount: 2191.2 }
          ]
        },
        deductions: [
          { deductionTypeCode: '001', code: '00301', concept: 'Seguridad Social', amount: 200 },
          { deductionTypeCode: '002', code: '00302', concept: 'ISR', amount: 100 }
        ],
        disabilities: [
          { disabilityDays: 1, disabilityTypeCode: '01' }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 6. NOMINA CON SNCF (Facturación por referencias)
// ============================================================================
async function nominaConSNCFByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Con SNCF ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(organicosNavezOsorioId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(xochiltCasasChavezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: organicosNavezOsorioId,
    employerRegistration: '27112029',
    satFundSourceId: 'IP'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: organicosNavezOsorioId,
    employeePersonId: xochiltCasasChavezId,
    socialSecurityNumber: '80997742673',
    laborRelationStartDate: '2021-09-01',
    seniority: 'P88W',
    satContractTypeId: '01',
    satTaxRegimeTypeId: '02',
    employeeNumber: '273',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '04',
    integratedDailySalary: 221.48,
    satPayrollStateId: 'GRO'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaConSNCFByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Con SNCF ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '39074',
    exportCode: '01',
    issuer: {
      id: organicosNavezOsorioId
    },
    recipient: {
      id: xochiltCasasChavezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-05-16T00:00:00',
        initialPaymentDate: '2023-05-01T00:00:00',
        finalPaymentDate: '2023-05-16T00:00:00',
        daysPaid: 15,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: 'P001', concept: 'Sueldos, Salarios Rayas y Jornales', taxedAmount: 3322.20, exemptAmount: 0.00 },
            { earningTypeCode: '038', code: 'P540', concept: 'Compensacion', taxedAmount: 100.00, exemptAmount: 0.00 },
            { earningTypeCode: '038', code: 'P550', concept: 'Compensación Garantizada Extraordinaria', taxedAmount: 2200.00, exemptAmount: 0.00 },
            { earningTypeCode: '038', code: 'P530', concept: 'Servicio Extraordinario', taxedAmount: 200.00, exemptAmount: 0.00 },
            { earningTypeCode: '001', code: 'P506', concept: 'Otras Prestaciones', taxedAmount: 1500.00, exemptAmount: 0.00 },
            { earningTypeCode: '001', code: 'P505', concept: 'Remuneración al Desempeño Legislativo', taxedAmount: 17500.00, exemptAmount: 0.00 }
          ],
          otherPayments: [
            { otherPaymentTypeCode: '002', code: 'o002', concept: 'Subsidio para el empleo efectivamente entregado al trabajador', amount: 0.00, subsidyCaused: 0.00 }
          ]
        },
        deductions: [
          { deductionTypeCode: '002', code: 'D002', concept: 'ISR', amount: 4716.61 },
          { deductionTypeCode: '004', code: 'D525', concept: 'Redondeo', amount: 0.81 },
          { deductionTypeCode: '001', code: 'D510', concept: 'Cuota Trabajador ISSSTE', amount: 126.78 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 7. NOMINA EXTRAORDINARIA - AGUINALDO (Facturación por referencias)
// ============================================================================
async function nominaExtraordinariaByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Extraordinaria (Aguinaldo) ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01',
    seniority: 'P439W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '99',
    satBankId: '002',
    bankAccount: '1111111111',
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaExtraordinariaByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Extraordinaria (Aguinaldo) ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'E',
        paymentDate: '2023-06-04T00:00:00',
        initialPaymentDate: '2023-06-04T00:00:00',
        finalPaymentDate: '2023-06-04T00:00:00',
        daysPaid: 30,
        earnings: {
          earnings: [
            { earningTypeCode: '002', code: '00500', concept: 'Gratificación Anual (Aguinaldo)', taxedAmount: 0.00, exemptAmount: 10000.00 }
          ],
          otherPayments: []
        },
        deductions: []
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 8. NOMINA SEPARACION INDEMNIZACION (Facturación por referencias)
// ============================================================================
async function nominaSeparacionIndemnizacionByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Separación Indemnización ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01',
    seniority: 'P439W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '99',
    satBankId: '002',
    bankAccount: '1111111111',
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaSeparacionIndemnizacionByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Separación Indemnización ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'E',
        paymentDate: '2023-06-04T00:00:00',
        initialPaymentDate: '2023-05-05T00:00:00',
        finalPaymentDate: '2023-06-04T00:00:00',
        daysPaid: 30,
        earnings: {
          earnings: [
            { earningTypeCode: '023', code: '00500', concept: 'Pagos por separación', taxedAmount: 0.00, exemptAmount: 10000.00 },
            { earningTypeCode: '025', code: '00900', concept: 'Indemnizaciones', taxedAmount: 0.00, exemptAmount: 500.00 }
          ],
          otherPayments: [],
          severance: {
            totalPaid: 10500.00,
            yearsOfService: 1,
            lastMonthlySalary: 10000.00,
            accumulableIncome: 10000.00,
            nonAccumulableIncome: 0.00
          }
        },
        deductions: []
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 9. NOMINA JUBILACION PENSION RETIRO (Facturación por referencias)
// ============================================================================
async function nominaJubilacionPensionRetiroByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Jubilación Pensión Retiro ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01',
    seniority: 'P439W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '99',
    satBankId: '002',
    bankAccount: '1111111111',
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaJubilacionPensionRetiroByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Jubilación Pensión Retiro ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'E',
        paymentDate: '2023-05-05T00:00:00',
        initialPaymentDate: '2023-06-04T00:00:00',
        finalPaymentDate: '2023-06-04T00:00:00',
        daysPaid: 30,
        earnings: {
          earnings: [
            { earningTypeCode: '039', code: '00500', concept: 'Jubilaciones, pensiones o haberes de retiro', taxedAmount: 0.00, exemptAmount: 10000.00 }
          ],
          retirement: {
            totalOneTime: 10000.00,
            accumulableIncome: 10000.00,
            nonAccumulableIncome: 0.00
          }
        },
        deductions: []
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 10. NOMINA SIN DEDUCCIONES (Facturación por referencias)
// ============================================================================
async function nominaSinDeduccionesByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Sin Deducciones ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01',
    seniority: 'P437W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '04',
    satBankId: '002',
    bankAccount: '1111111111',
    baseSalaryForContributions: 490.22,
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaSinDeduccionesByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Sin Deducciones ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-05-24T00:00:00',
        initialPaymentDate: '2023-05-09T00:00:00',
        finalPaymentDate: '2023-05-24T00:00:00',
        daysPaid: 15,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: '00500', concept: 'Sueldos, Salarios Rayas y Jornales', taxedAmount: 2808.8, exemptAmount: 2191.2 }
          ],
          otherPayments: []
        },
        deductions: []
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 11. NOMINA SUBSIDIO CAUSADO (Facturación por referencias)
// ============================================================================
async function nominaSubsidioCausadoByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Subsidio Causado ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01T00:00:00',
    seniority: 'P437W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '02',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '04',
    satBankId: '002',
    bankAccount: '1111111111',
    baseSalaryForContributions: 490.22,
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaSubsidioCausadoByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Subsidio Causado ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-05-24T00:00:00',
        initialPaymentDate: '2023-05-09T00:00:00',
        finalPaymentDate: '2023-05-24T00:00:00',
        daysPaid: 15,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: '00500', concept: 'Sueldos, Salarios Rayas y Jornales', taxedAmount: 2808.8, exemptAmount: 2191.2 }
          ],
          otherPayments: [
            { otherPaymentTypeCode: '007', code: '0002', concept: 'ISR ajustado por subsidio', amount: 145.80, subsidyCaused: 0.0 }
          ]
        },
        deductions: [
          { deductionTypeCode: '107', code: 'D002', concept: 'Ajuste al Subsidio Causado', amount: 160.35 },
          { deductionTypeCode: '002', code: 'D002', concept: 'ISR', amount: 145.80 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 12. NOMINA VIATICOS (Facturación por referencias)
// ============================================================================
async function nominaViaticosByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina Viáticos ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01T00:00:00',
    seniority: 'P438W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '04',
    satBankId: '002',
    bankAccount: '1111111111',
    baseSalaryForContributions: 490.22,
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaViaticosByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina Viáticos ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-09-26T00:00:00',
        initialPaymentDate: '2023-09-11T00:00:00',
        finalPaymentDate: '2023-09-26T00:00:00',
        daysPaid: 15,
        earnings: {
          earnings: [
            { earningTypeCode: '050', code: '050', concept: 'Viaticos', taxedAmount: 0, exemptAmount: 3000 }
          ]
        },
        deductions: [
          { deductionTypeCode: '081', code: '081', concept: 'Ajuste en viaticos entregados al trabajador', amount: 3000 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 13. NOMINA GENERAL (Facturación por referencias)
// ============================================================================
async function nominaGeneralByReferencesSetupData(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Setup: Nómina General ByReferences ===\n');

  // Eliminar datos existentes (idempotente)
  try { await client.persons.employer.delete(escuelaKemperUrgateId); } catch { /* ignore */ }
  try { await client.persons.employee.delete(ingridXodarJimenezId); } catch { /* ignore */ }

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
    originEmployerTin: 'URE180429TM6'
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: ingridXodarJimenezId,
    socialSecurityNumber: '000000',
    laborRelationStartDate: '2015-01-01T00:00:00',
    seniority: 'P437W',
    satContractTypeId: '01',
    satWorkdayTypeId: '01',
    satTaxRegimeTypeId: '03',
    employeeNumber: '120',
    department: 'Desarrollo',
    position: 'Ingeniero de Software',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '04',
    satBankId: '002',
    bankAccount: '1111111111',
    baseSalaryForContributions: 490.22,
    integratedDailySalary: 146.47,
    satPayrollStateId: 'JAL'
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));
}

async function nominaGeneralByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Nómina General ByReferences ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'N',
    expeditionZipCode: '20000',
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: ingridXodarJimenezId
    },
    complement: {
      payroll: {
        version: '1.2',
        payrollTypeCode: 'O',
        paymentDate: '2023-05-24T00:00:00',
        initialPaymentDate: '2023-05-09T00:00:00',
        finalPaymentDate: '2023-05-24T00:00:00',
        daysPaid: 15,
        earnings: {
          earnings: [
            { earningTypeCode: '001', code: '00500', concept: 'Sueldos, Salarios Rayas y Jornales', taxedAmount: 2808.8, exemptAmount: 2191.2 }
          ],
          otherPayments: []
        },
        deductions: [
          { deductionTypeCode: '001', code: '00301', concept: 'Seguridad Social', amount: 200 },
          { deductionTypeCode: '002', code: '00302', concept: 'ISR', amount: 100 }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// FUNCION PRINCIPAL
// ============================================================================
async function main(): Promise<void> {
  console.log('=== Ejemplos de Factura Nómina FiscalAPI (Referencias) ===\n');

  const client = FiscalapiClient.create(settings);

  try {
    // Descomentar el caso de uso que se desea ejecutar
    // IMPORTANTE: Ejecutar primero la función de setup, luego la de factura

    // 1. Nómina Ordinaria
     await nominaOrdinariaByReferencesSetupData(client);
     await nominaOrdinariaByReferences(client);

    // 2. Nómina Asimilados
    // await nominaAsimiladosByReferencesSetupData(client);
    // await nominaAsimiladosByReferences(client);

    // 3. Nómina Con Bonos y Fondo de Ahorro
    // await nominaConBonosFondoAhorroByReferencesSetupData(client);
    // await nominaConBonosFondoAhorroByReferences(client);

    // 4. Nómina Con Horas Extra
    // await nominaConHorasExtraByReferencesSetupData(client);
    // await nominaConHorasExtraByReferences(client);

    // 5. Nómina Con Incapacidades
    // await nominaConIncapacidadesByReferencesSetupData(client);
    // await nominaConIncapacidadesByReferences(client);

    // 6. Nómina Con SNCF
    // await nominaConSNCFByReferencesSetupData(client);
    // await nominaConSNCFByReferences(client);

    // 7. Nómina Extraordinaria (Aguinaldo)
    // await nominaExtraordinariaByReferencesSetupData(client);
    // await nominaExtraordinariaByReferences(client);

    // 8. Nómina Separación Indemnización
    // await nominaSeparacionIndemnizacionByReferencesSetupData(client);
    // await nominaSeparacionIndemnizacionByReferences(client);

    // 9. Nómina Jubilación Pensión Retiro
    // await nominaJubilacionPensionRetiroByReferencesSetupData(client);
    // await nominaJubilacionPensionRetiroByReferences(client);

    // 10. Nómina Sin Deducciones
    // await nominaSinDeduccionesByReferencesSetupData(client);
    // await nominaSinDeduccionesByReferences(client);

    // 11. Nómina Subsidio Causado
    // await nominaSubsidioCausadoByReferencesSetupData(client);
    // await nominaSubsidioCausadoByReferences(client);

    // 12. Nómina Viáticos
    // await nominaViaticosByReferencesSetupData(client);
    // await nominaViaticosByReferences(client);

    // 13. Nómina General
     await nominaGeneralByReferencesSetupData(client);
     await nominaGeneralByReferences(client);

    console.log('\nEjecución completada.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar función principal
main();
