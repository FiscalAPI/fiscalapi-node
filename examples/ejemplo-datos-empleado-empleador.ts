import {
  FiscalapiClient,
  FiscalapiSettings,
  CreateEmployerRequest,
  CreateEmployeeRequest
} from '../src';

async function main(): Promise<void> {

   const settings: FiscalapiSettings = {
    apiUrl: 'https://test.fisalapi.com',
    apiKey: '<API_KEY>',
    tenant: '<TENANT_ID>',
  };

  const client = FiscalapiClient.create(settings);

  const escuelaKemperUrgateId = '<id-empleador>';
  const karlaFuenteNolascoId = '<id-empleado>';

  // Crear datos de empleador
  const employerRequest: CreateEmployerRequest = {
    personId: escuelaKemperUrgateId,
    employerRegistration: 'B5510768108',
  };
  const employerResult = await client.persons.employer.create(employerRequest);
  console.log('Empleador:', JSON.stringify(employerResult, null, 2));

  // Crear datos de empleado
  const employeeRequest: CreateEmployeeRequest = {
    employerPersonId: escuelaKemperUrgateId,
    employeePersonId: karlaFuenteNolascoId,
    employeeNumber: '123456789',
    socialSecurityNumber: '04078873454',
    laborRelationStartDate: '2024-08-18',
    satContractTypeId: '01',
    satTaxRegimeTypeId: '02',
    satJobRiskId: '1',
    satPaymentPeriodicityId: '05',
    satBankId: '012',
    satPayrollStateId: 'JAL',
    department: 'GenAI',
    position: 'Sr Software Engineer',
    seniority: 'P54W',
    baseSalaryForContributions: 2828.50,
    integratedDailySalary: 0.00,
  };
  const employeeResult = await client.persons.employee.create(employeeRequest);
  console.log('Empleado:', JSON.stringify(employeeResult, null, 2));

  // Consultar datos
  const employer = await client.persons.employer.getById(escuelaKemperUrgateId);
  console.log('Consulta empleador:', JSON.stringify(employer, null, 2));

  const employee = await client.persons.employee.getById(karlaFuenteNolascoId);
  console.log('Consulta empleado:', JSON.stringify(employee, null, 2));
}

main().catch(console.error);
