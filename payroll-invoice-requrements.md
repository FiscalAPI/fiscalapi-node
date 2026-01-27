

# IDs de personas para los ejemplos
escuela_kemper_urgate_id = "2e7b988f-3a2a-4f67-86e9-3f931dd48581"
karla_fuente_nolasco_id = "109f4d94-63ea-4a21-ab15-20c8b87d8ee9"
organicos_navez_osorio_id = "f645e146-f80e-40fa-953f-fd1bd06d4e9f"
xochilt_casas_chavez_id = "e3b4edaa-e4d9-4794-9c5b-3dd5b7e372aa"
ingrid_xodar_jimenez_id = "9367249f-f0ee-43f4-b771-da2fff3f185f"
OSCAR_KALA_HAAK = "5fd9f48c-a6a2-474f-944b-88a01751d432"


apiUrl: http://localhost:5001
apikey: sk_development_b470ea83_3c0f_4209_b933_85223b960d91
tenant: 102e5f13-e114-41dd-bea7-507fce177281

productId: 69d0aec0-5dbb-4db0-a908-61fe5c8e7d75


----


You are a senior Node.js engineer specializing in TypeScript, module systems, and mexican payroll cdfi invoicing. Your task is to 
add payroll invoice support to the existing code base following best practices. 


# Important
-Make sure you follow the current project programing language, naming conventions and best practices for the current language and framework.
-Make sure you DO NOT ADD ACCIDENTAL COMPLEXITY, only add essential complexity. You can achieve this by reading the codebase thoroughly. DO NOT ASUME ANYTHING, BASE IT ON FACTS AND THE CURRENT STATE OF THE CODE. DO NOT DUPLICATE CODE.

## Stamp resource
Implememt following changes as follows:

Create a new service called StampService and add a new property 'stamps'  on FiscalApiClient facade
the ultimage goal is add support for /api/v4/stamps resource.


### Models

StampTransaction:
	consecutive: int,
	from_person: UserLookupDto,
    to_person: UserLookupDto,
    amount: int,
    transaction_type: int,
    transaction_status: int,
    reference_id: str,
    comments: str,
    id: Optional[str] = None,
		
StampTransactionParams		
	 from_person_id: str,
     to_person_id: str,
     amount: int,
     comments: str,

### Service
class StampService:

    def transfer_stamps(self, request: StampTransactionParams) -> bool:
        # lógica real aquí (HTTP, DB, lo que sea)
        return True

    def withdraw_stamps(self, request: StampTransactionParams) -> bool:
        # lógica real aquí
        return True



#Resource endpoints

Listar movimientos

## Request
curl --location 'http://localhost:5001/api/v4/stamps?pageNumber=1&pageSize=2' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--data ''

### Response
{
    "data": {
        "items": [
            {
                "consecutive": 9,
                "fromPerson": {
                    "tin": "FAP240304AU3",
                    "legalName": "FISCAL API",
                    "id": "1",
                    "createdAt": "2024-08-10T15:46:30.373",
                    "updatedAt": "2025-11-02T13:12:47.205"
                },
                "toPerson": {
                    "tin": "KAHO641101B39",
                    "legalName": "OSCAR KALA HAAK",
                    "id": "5fd9f48c-a6a2-474f-944b-88a01751d432",
                    "createdAt": "2025-01-07T15:15:00.305",
                    "updatedAt": "2025-11-03T19:19:48.455"
                },
                "amount": 100,
                "transactionType": 1,
                "transactionStatus": 1,
                "referenceId": "46aecf10-5e63-48e9-a101-bbb3cda10b38",
                "comments": null,
                "id": "77678d6d-94b1-4635-aa91-15cdd7423aab",
                "createdAt": "2025-08-08T21:01:07.583",
                "updatedAt": "2025-08-08T21:01:07.583"
            },
            {
                "consecutive": 11,
                "fromPerson": {
                    "tin": "FAP240304AU3",
                    "legalName": "FISCAL API",
                    "id": "1",
                    "createdAt": "2024-08-10T15:46:30.373",
                    "updatedAt": "2025-11-02T13:12:47.205"
                },
                "toPerson": {
                    "tin": "KAHO641101B39",
                    "legalName": "OSCAR KALA HAAK",
                    "id": "5fd9f48c-a6a2-474f-944b-88a01751d432",
                    "createdAt": "2025-01-07T15:15:00.305",
                    "updatedAt": "2025-11-03T19:19:48.455"
                },
                "amount": 500,
                "transactionType": 1,
                "transactionStatus": 1,
                "referenceId": "7452186b-f890-4cad-90df-f478335ce117",
                "comments": null,
                "id": "e22e17d1-48c5-49a5-af71-a56cae4bdd95",
                "createdAt": "2025-08-10T12:12:50.496",
                "updatedAt": "2025-08-10T12:12:50.496"
            }
        ],
        "pageNumber": 1,
        "totalPages": 21,
        "totalCount": 207,
        "hasPreviousPage": false,
        "hasNextPage": true
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}


---
Obtener movimiento por ID

### Request
curl --location 'http://localhost:5001/api/v4/stamps/77678d6d-94b1-4635-aa91-15cdd7423aab' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data ''

### Response
{
    "data": {
        "consecutive": 9,
        "fromPerson": {
            "tin": "FAP240304AU3",
            "legalName": "FISCAL API",
            "id": "1",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": "2025-11-02T13:12:47.205"
        },
        "toPerson": {
            "tin": "KAHO641101B39",
            "legalName": "OSCAR KALA HAAK",
            "id": "5fd9f48c-a6a2-474f-944b-88a01751d432",
            "createdAt": "2025-01-07T15:15:00.305",
            "updatedAt": "2025-11-03T19:19:48.455"
        },
        "amount": 100,
        "transactionType": 1,
        "transactionStatus": 1,
        "referenceId": "46aecf10-5e63-48e9-a101-bbb3cda10b38",
        "comments": null,
        "id": "77678d6d-94b1-4635-aa91-15cdd7423aab",
        "createdAt": "2025-08-08T21:01:07.583",
        "updatedAt": "2025-08-08T21:01:07.583"
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}

---
Transferir Timbres

### Request
curl --location 'http://localhost:5001/api/v4/stamps' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
  "fromPersonId": "1",
  "toPersonId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
  "amount": 1,
  "comments": "Compra 001"
}'

### Response
{
    "data": true,
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}


### Retirar Timbres
curl --location 'http://localhost:5001/api/v4/stamps' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
  "fromPersonId": "1",
  "toPersonId": "1a18f812-c623-448f-a222-9b7e4e3fd4b2",
  "amount": 99,
  "comments": "No se confirmó el pago..."
}'

### Response
{
    "data": true,
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}

---

You are a senior Node.js engineer specializing in TypeScript, module systems, and mexican payroll cdfi invoicing. Your task is to 
add payroll invoice support to the existing code base following best practices. 


# Important
-Make sure you follow the current project programing language, naming conventions and best practices for the current language and framework.
-Make sure you DO NOT ADD ACCIDENTAL COMPLEXITY, only add essential complexity. You can achieve this by reading the codebase thoroughly. DO NOT ASUME ANYTHING, BASE IT ON FACTS AND THE CURRENT STATE OF THE CODE. DO NOT DUPLICATE CODE.

## Employee/Employer sub-resources

Implememt following changes as follows:

interface IEmployeeService {
  getById(id: string): Promise<ApiResponse<EmployeeData>>
  create(requestModel: CreateEmployeeRequest): Promise<ApiResponse<EmployeeData>>
  update(requestModel: UpdateEmployeeRequest): Promise<ApiResponse<EmployeeData>>
  delete(personId: string): Promise<ApiResponse<void>>
}

interface IEmployerService {
  getById(id: string): Promise<ApiResponse<EmployerData>>
  create(requestModel: CreateEmployerRequest): Promise<ApiResponse<EmployerData>>
  update(requestModel: UpdateEmployerRequest): Promise<ApiResponse<EmployerData>>
  delete(personId: string): Promise<ApiResponse<void>>
}

interface PersonService {
  employee: IEmployeeService
  employer: IEmployerService
}

interface FiscalapiClient {
  persons: PersonsService
}


### Obtener datos de empleador
curl --location 'http://localhost:5001/api/v4/people/bef56254-0892-4558-95c3-f9c8729e4b0e/employer' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91'

response
{
    "data": {
        "personId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
        "employerRegistration": "A1230768108",
        "originEmployerTin": "ARE180429TM6",
        "satFundSource": {
            "id": "IP",
            "description": "Ingresos propios.",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "ownResourceAmount": 1500,
        "id": "23f0b555-68bc-48fd-bb90-deb36ed25ef6",
        "createdAt": "2025-09-18T20:17:44.175",
        "updatedAt": "2025-09-18T20:17:48.489"
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}


### Crear datos de empleador
curl --location 'http://localhost:5001/api/v4/people/bef56254-0892-4558-95c3-f9c8729e4b0e/employer' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
  "personId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
  "employerRegistration": "B5510768108",
  "originEmployerTin": "URE180429TM6",
  "satFundSourceId": null,
  "ownResourceAmount": null
}
'

Response
{
    "data": {
        "personId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
        "employerRegistration": "B5510768108",
        "originEmployerTin": "URE180429TM6",
        "satFundSource": null,
        "ownResourceAmount": null,
        "id": "23f0b555-68bc-48fd-bb90-deb36ed25ef6",
        "createdAt": "2025-09-18T20:17:44.175",
        "updatedAt": "2025-09-18T20:17:44.175"
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}

### Actualizar datos de empleador

curl --location --request PUT 'http://localhost:5001/api/v4/people/bef56254-0892-4558-95c3-f9c8729e4b0e/employer' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
  "personId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
  "employerRegistration": "A1230768108",
  "originEmployerTin": "ARE180429TM6",
  "satFundSourceId": null,
  "ownResourceAmount": null
}'

Response
{
    "data": {
        "personId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
        "employerRegistration": "A1230768108",
        "originEmployerTin": "ARE180429TM6",
        "satFundSource": null,
        "ownResourceAmount": null,
        "id": "23f0b555-68bc-48fd-bb90-deb36ed25ef6",
        "createdAt": "2025-09-18T20:17:44.175",
        "updatedAt": "2025-09-18T20:19:20.569"
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}

### Eliminar datos de empleador

curl --location --request DELETE 'http://localhost:5001/api/v4/people/bef56254-0892-4558-95c3-f9c8729e4b0e/employer' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data ''

Response
{
    "data": true,
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}


### Obtener datos de empleado
curl --location 'http://localhost:5001/api/v4/people/54fc14ae-c88f-4afc-996b-0574d63341e2/employee' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data ''

Response
{
    "data": {
        "employerPersonId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
        "employeePersonId": "54fc14ae-c88f-4afc-996b-0574d63341e2",
        "employeeNumber": "123456789",
        "socialSecurityNumber": "0101010101",
        "laborRelationStartDate": "2020-01-12T00:00:00.000",
        "satContractType": {
            "id": "01",
            "description": "Contrato de trabajo por tiempo indeterminado",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satTaxRegimeType": {
            "id": "02",
            "description": "Sueldos (Incluye ingresos art. 94 LISR)",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satWorkdayType": null,
        "satJobRisk": {
            "id": "1",
            "description": "Clase I",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satPaymentPeriodicity": {
            "id": "04",
            "description": "Quincenal",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satBank": null,
        "satPayrollState": {
            "id": "JAL",
            "description": "Jalisco",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satUnionizedStatus": null,
        "department": null,
        "position": null,
        "seniority": "P1Y5M15D",
        "bankAccount": null,
        "baseSalaryForContributions": 520,
        "integratedDailySalary": 186,
        "subcontractorRfc": null,
        "timePercentage": 0
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}

### Crear datos de empleado
curl --location 'http://localhost:5001/api/v4/people/54fc14ae-c88f-4afc-996b-0574d63341e2/employee' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '
{
  "employerPersonId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
  "employeePersonId": "54fc14ae-c88f-4afc-996b-0574d63341e2",
  "employeeNumber": "12345",
  "satContractTypeId": "01",
  "satTaxRegimeTypeId": "02",
  "satPaymentPeriodicityId": "04",
  "satPayrollStateId": "JAL",
  "socialSecurityNumber": "123456789012345",
  "laborRelationStartDate": "2023-01-15T00:00:00",
  "satWorkdayTypeId": "01",
  "satJobRiskId": "1",
  "satBankId": "002",
  "satUnionizedStatusId": "No",
  "department": "Recursos Humanos",
  "position": "Analista de Nóminas",
  "seniority": "7Y3M1W",
  "bankAccount": "12345678901234567890",
  "baseSalaryForContributions": 490.22,
  "integratedDailySalary": 146.47,
  "subcontractorRfc": null,
  "timePercentage": null
}'

Response:
{
    "data": {
        "employerPersonId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
        "employeePersonId": "54fc14ae-c88f-4afc-996b-0574d63341e2",
        "employeeNumber": "12345",
        "socialSecurityNumber": "123456789012345",
        "laborRelationStartDate": "2023-01-15T00:00:00.000",
        "satContractType": {
            "id": "01",
            "description": "Contrato de trabajo por tiempo indeterminado",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satTaxRegimeType": {
            "id": "02",
            "description": "Sueldos (Incluye ingresos señalados en la fraccion I del articulo 94 de LISR)",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satWorkdayType": {
            "id": "01",
            "description": "Diurna",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satJobRisk": {
            "id": "1",
            "description": "Clase I",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satPaymentPeriodicity": {
            "id": "04",
            "description": "Quincenal",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satBank": {
            "id": "002",
            "description": "BANAMEX",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satPayrollState": {
            "id": "JAL",
            "description": "Jalisco",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satUnionizedStatus": {
            "id": "No",
            "description": "NO",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "department": "Recursos Humanos",
        "position": "Analista de Nóminas",
        "bankAccount": "12345678901234567890",
        "baseSalaryForContributions": 490.22,
        "integratedDailySalary": 146.47,
        "subcontractorRfc": null,
        "timePercentage": 0
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}

### Actualizar datos de empleado
curl --location --request PUT 'http://localhost:5001/api/v4/people/54fc14ae-c88f-4afc-996b-0574d63341e2/employee' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '
{
  "employerPersonId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
  "employeePersonId": "54fc14ae-c88f-4afc-996b-0574d63341e2",
  "employeeNumber": "12345ABC",
  "satContractTypeId": "02",
  "satTaxRegimeTypeId": "02",
  "satPaymentPeriodicityId": "02",
  "satPayrollStateId": "AGU",
  "socialSecurityNumber": "123456789012345",
  "laborRelationStartDate": "2022-01-15T00:00:00",
  "satWorkdayTypeId": "01",
  "satJobRiskId": "2",
  "satBankId": "012",
  "satUnionizedStatusId": "Sí",
  "department": "Sistemas",
  "position": "Programador Jr.",
  "seniority": "7Y3M1W",
  "bankAccount": "12345678901234567890",
  "baseSalaryForContributions": 290.22,
  "integratedDailySalary": 46.47,
  "subcontractorRfc": null,
  "timePercentage": null
}'

Response:
{
    "data": {
        "employerPersonId": "bef56254-0892-4558-95c3-f9c8729e4b0e",
        "employeePersonId": "54fc14ae-c88f-4afc-996b-0574d63341e2",
        "employeeNumber": "12345ABC",
        "socialSecurityNumber": "123456789012345",
        "laborRelationStartDate": "2022-01-15T00:00:00.000",
        "satContractType": {
            "id": "02",
            "description": "Contrato de trabajo para obra determinada",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satTaxRegimeType": {
            "id": "02",
            "description": "Sueldos (Incluye ingresos señalados en la fraccion I del articulo 94 de LISR)",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satWorkdayType": {
            "id": "01",
            "description": "Diurna",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satJobRisk": {
            "id": "2",
            "description": "Clase II",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satPaymentPeriodicity": {
            "id": "02",
            "description": "Semanal",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satBank": {
            "id": "012",
            "description": "BBVA BANCOMER",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satPayrollState": {
            "id": "AGU",
            "description": "Aguascalientes",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "satUnionizedStatus": {
            "id": "Sí",
            "description": "SI",
            "createdAt": "2024-08-10T15:46:30.373",
            "updatedAt": null
        },
        "department": "Sistemas",
        "position": "Programador Jr.",
        "bankAccount": "12345678901234567890",
        "baseSalaryForContributions": 290.22,
        "integratedDailySalary": 46.47,
        "subcontractorRfc": null,
        "timePercentage": 0
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}


### Eliminar datos de empleado
curl --location --request DELETE 'http://localhost:5001/api/v4/people/54fc14ae-c88f-4afc-996b-0574d63341e2/employee' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data-raw '{
  "legalName": "MI EMPRESA DUMMY",
  "email": "miempresa@domain.com",
  "password": "UserPass123!"
}'

Response:
{
    "data": true,
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}

---
You are a senior Node.js engineer specializing in TypeScript, module systems, and mexican payroll cdfi invoicing. Your task is to 
add payroll invoice support to the existing code base following best practices. 


# Important
-Make sure you follow the current project programing language, naming conventions and best practices for the current language and framework.
-Make sure you DO NOT ADD ACCIDENTAL COMPLEXITY, only add essential complexity. You can achieve this by reading the codebase thoroughly. DO NOT ASUME ANYTHING, BASE IT ON FACTS AND THE CURRENT STATE OF THE CODE. DO NOT DUPLICATE CODE.


## Invoices resource

Implememt following changes as follows:

- Change invoice enpoint to the unified version for all methods
- Update the invoice request model to the unified version
- creare a new file named ejemplos-factura-nomina.ts con una funcion para cada caso de uso un comentario y 
un una funcion principal para que invoque todas las funciones de los casos de uso, asegurate de agregar el sufijo 'ByValues' al nombre del metodo, todos estos metodos son por valores, signifca que todo los datos se pasan en la peticion http. 

    // ============================================================================
    // 1. NOMINA ORDINARIA (Facturación por valores)
    // ============================================================================
    nominaOrdinariaByValues(){
        //implementation
    }

- Use this names for the models and make sure the any complement is property modeled. becarefull with payment complement that alrredy exist, only need to be moved from invoice.payments?: InvoicePayment[]; to Complement.PaymentComplement:
Models names to use.
* Invoice
* Complement
* Complement.LocalTaxesComplement (Invoice.complement.localTaxes)
* Complement.LocalTaxesComplement.LocalTax
* Complement.PaymentComplement (Invoice.complement.payments)
* Complement.PaymentComplement.PaidInvoice
* Complement.PaymentComplement.PaidInvoice.PaidInvoiceTax
* Complement.PayrollComplement (Invoice.complement.payroll)
* Complement.PayrollComplement.Earnings
* Complement.PayrollComplement.Earnings.Earning
* Complement.PayrollComplement.Earnings.Earning.StockOptions
* Complement.PayrollComplement.Earnings.Earning.Overtime
* Complement.PayrollComplement.Earnings.OtherPayment
* Complement.PayrollComplement.Earnings.OtherPayment.BalanceCompensation
* Complement.PayrollComplement.Earnings.Retirement
* Complement.PayrollComplement.Earnings.Severance
* Complement.PayrollComplement.Deduction
* Complement.PayrollComplement.Disability
* Complement.LadingComplement (Invoice.Complement.landing)
- Make sure all existing models are updated or new models are acreated. 


## Unified Invoice Endpoint and model

curl http://localhost:5001/api/v4/invoices \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "versionCode": null,
  "paymentFormCode": null,
  "paymentMethodCode": null,
  "currencyCode": null,
  "typeCode": null,
  "expeditionZipCode": null,
  "pacConfirmation": null,
  "series": null,
  "number": null,
  "date": "",
  "paymentConditions": null,
  "exchangeRate": 1,
  "exportCode": null,
  "issuer": {
    "id": null,
    "tin": null,
    "legalName": null,
    "taxRegimeCode": null,
    "employerData": {
      "curp": null,
      "employerRegistration": null,
      "originEmployerTin": null,
      "satFundSourceId": null,
      "ownResourceAmount": null
    },
    "taxCredentials": [
      {
        "id": null,
        "base64File": null,
        "fileType": 1,
        "password": null
      }
    ]
  },
  "recipient": {
    "id": null,
    "tin": null,
    "legalName": null,
    "zipCode": null,
    "taxRegimeCode": null,
    "cfdiUseCode": null,
    "email": null,
    "foreignCountryCode": null,
    "foreignTin": null,
    "employeeData": {
      "curp": null,
      "socialSecurityNumber": null,
      "laborRelationStartDate": null,
      "seniority": null,
      "satContractTypeId": null,
      "satUnionizedStatusId": null,
      "satWorkdayTypeId": null,
      "satTaxRegimeTypeId": null,
      "employeeNumber": null,
      "department": null,
      "...": "[Additional Properties Truncated]"
    }
  },
  "items": [
    {
      "id": null,
      "itemCode": null,
      "itemSku": null,
      "quantity": 1,
      "unitOfMeasurementCode": null,
      "description": null,
      "unitPrice": 1,
      "discount": 1,
      "taxObjectCode": null,
      "itemTaxes": [
        {
          "taxCode": null,
          "taxTypeCode": null,
          "taxRate": 1,
          "taxFlagCode": null
        }
      ],
      "onBehalfOf": {
        "tin": null,
        "legalName": null,
        "taxRegimeCode": null,
        "zipCode": null
      },
      "customsInfo": [
        {
          "customsNumber": null
        }
      ],
      "propertyInfo": [
        {
          "number": null
        }
      ],
      "parts": [
        {
          "itemCode": null,
          "itemSku": null,
          "quantity": 1,
          "unitOfMeasurementCode": null,
          "description": null,
          "unitPrice": 1,
          "customsInfo": [
            {
              "customsNumber": null
            }
          ]
        }
      ]
    }
  ],
  "globalInformation": {
    "periodicityCode": null,
    "monthCode": null,
    "year": 1
  },
  "relatedInvoices": [
    {
      "relationshipTypeCode": null,
      "uuid": null
    }
  ],
  "complement": {
    "localTaxes": {
      "taxes": [
        {
          "taxName": null,
          "taxRate": 1,
          "taxAmount": 1,
          "taxFlagCode": null
        }
      ]
    },
    "payment": {
      "paymentDate": "",
      "paymentFormCode": null,
      "currencyCode": "",
      "exchangeRate": 1,
      "amount": 1,
      "operationNumber": null,
      "sourceBankTin": null,
      "sourceBankAccount": null,
      "targetBankTin": null,
      "targetBankAccount": null,
      "...": "[Additional Properties Truncated]"
    },
    "payroll": {
      "version": "",
      "payrollTypeCode": null,
      "paymentDate": "",
      "initialPaymentDate": "",
      "finalPaymentDate": "",
      "daysPaid": 1,
      "earnings": {
        "earnings": [
          {
            "earningTypeCode": "",
            "code": "",
            "concept": "",
            "taxedAmount": 1,
            "exemptAmount": 1,
            "stockOptions": {
              "marketPrice": "[Max Depth Exceeded]",
              "grantPrice": "[Max Depth Exceeded]"
            },
            "overtime": [
              {
                "days": "[Max Depth Exceeded]",
                "hoursTypeCode": "[Max Depth Exceeded]",
                "extraHours": "[Max Depth Exceeded]",
                "amountPaid": "[Max Depth Exceeded]"
              }
            ]
          }
        ],
        "otherPayments": [
          {
            "otherPaymentTypeCode": "",
            "code": "",
            "concept": "",
            "amount": 1,
            "subsidyCaused": null,
            "balanceCompensation": {
              "favorableBalance": "[Max Depth Exceeded]",
              "year": "[Max Depth Exceeded]",
              "remainingFavorableBalance": "[Max Depth Exceeded]"
            }
          }
        ],
        "retirement": {
          "totalOneTime": 1,
          "totalInstallments": 1,
          "dailyAmount": 1,
          "accumulableIncome": 1,
          "nonAccumulableIncome": 1
        },
        "severance": {
          "totalPaid": 1,
          "yearsOfService": 1,
          "lastMonthlySalary": 1,
          "accumulableIncome": 1,
          "nonAccumulableIncome": 1
        }
      },
      "deductions": [
        {
          "deductionTypeCode": "",
          "code": "",
          "concept": "",
          "amount": 1
        }
      ],
      "disabilities": [
        {
          "disabilityDays": 1,
          "disabilityTypeCode": "",
          "monetaryAmount": 1
        }
      ]
    },
    "lading": {}
  },
  "metadata": null
}'


## Payroll use cases 

### Factura Nómina - Nómina Ordinaria
curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "FUNK671228PH6",
        "legalName": "KARLA FUENTE NOLASCO",
        "zipCode": "01160",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101MNEXXXA8",
            "socialSecurityNumber": "04078873454",
            "laborRelationStartDate": "2024-08-18",
            "seniority": "P54W",
            "satContractTypeId": "01",
            "satTaxRegimeTypeId": "02",
            "employeeNumber": "123456789",
            "department": "GenAI",
            "position": "Sr Software Engineer",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "05",
            "satBankId": "012",
            "baseSalaryForContributions": 2828.50,
            "integratedDailySalary": 0.00,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2025-08-30",
            "initialPaymentDate": "2025-07-31",
            "finalPaymentDate": "2025-08-30",
            "daysPaid": 30,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "1003",
                        "concept": "Sueldo Nominal",
                        "taxedAmount": 95030.00,
                        "exemptAmount": 0.00
                    },
                    {
                        "earningTypeCode": "005",
                        "code": "5913",
                        "concept": "Fondo de Ahorro Aportación Patrón",
                        "taxedAmount": 0.00,
                        "exemptAmount": 4412.46
                    },
                    {
                        "earningTypeCode": "038",
                        "code": "1885",
                        "concept": "Bono Ingles",
                        "taxedAmount": 14254.50,
                        "exemptAmount": 0.00
                    },
                    {
                        "earningTypeCode": "029",
                        "code": "1941",
                        "concept": "Vales Despensa",
                        "taxedAmount": 0.00,
                        "exemptAmount": 3439.00
                    },
                    {
                        "earningTypeCode": "038",
                        "code": "1824",
                        "concept": "Herramientas Teletrabajo (telecom y prop. electri)",
                        "taxedAmount": 273.00,
                        "exemptAmount": 0.00
                    }
                ],
                "otherPayments": [
                    {
                        "otherPaymentTypeCode": "002",
                        "code": "5050",
                        "concept": "Exceso de subsidio al empleo",
                        "amount": 0.00,
                        "subsidyCaused": 0.00
                    }
                ]
            },
            "deductions": [
                {
                    "deductionTypeCode": "002",
                    "code": "5003",
                    "concept": "ISR Causado",
                    "amount": 27645.52
                },
                {
                    "deductionTypeCode": "004",
                    "code": "5910",
                    "concept": "Fondo de ahorro Empleado Inversión",
                    "amount": 4412.46
                },
                {
                    "deductionTypeCode": "004",
                    "code": "5914",
                    "concept": "Fondo de Ahorro Patrón Inversión",
                    "amount": 4412.46
                },
                {
                    "deductionTypeCode": "004",
                    "code": "1966",
                    "concept": "Contribución póliza exceso GMM",
                    "amount": 519.91
                },
                {
                    "deductionTypeCode": "004",
                    "code": "1934",
                    "concept": "Descuento Vales Despensa",
                    "amount": 1.00
                },
                {
                    "deductionTypeCode": "004",
                    "code": "1942",
                    "concept": "Vales Despensa Electrónico",
                    "amount": 3439.00
                },
                {
                    "deductionTypeCode": "001",
                    "code": "1895",
                    "concept": "IMSS",
                    "amount": 2391.13
                }
            ]
        }
    }
}'


### Factura Nómina - Nómina Asimilados
curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "06880",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "originEmployerTin": "EKU9003173C9"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "CACX7605101P8",
        "legalName": "XOCHILT CASAS CHAVEZ",
        "zipCode": "36257",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "satContractTypeId": "09",
            "satUnionizedStatusId": "No",
            "satTaxRegimeTypeId": "09",
            "employeeNumber": "00002",
            "department": "ADMINISTRACION",
            "position": "DIRECTOR DE ADMINISTRACION",
            "satPaymentPeriodicityId": "99",
            "satBankId": "012",
            "bankAccount": "1111111111",
            "satPayrollStateId": "CMX"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "E",
            "paymentDate": "2023-06-02T00:00:00",
            "initialPaymentDate": "2023-06-01T00:00:00",
            "finalPaymentDate": "2023-06-02T00:00:00",
            "daysPaid": 1,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "046",
                        "code": "010046",
                        "concept": "INGRESOS ASIMILADOS A SALARIOS",
                        "taxedAmount": 111197.73,
                        "exemptAmount": 0.00
                    }
                ],
                "otherPayments": []
            },
            "deductions": [
                {
                    "deductionTypeCode": "002",
                    "code": "020002",
                    "concept": "ISR",
                    "amount": 36197.73
                }
            ]
        }
    }
}'


### Factura Nómina - Nómina Con Bonos, Fondo Ahorro y Deducciones
curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "Z0000001234"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101MNEXXXA8",
            "socialSecurityNumber": "0000000000",
            "laborRelationStartDate": "2022-03-02T00:00:00",
            "seniority": "P66W",
            "satContractTypeId": "01",
            "satUnionizedStatusId": "No",
            "satTaxRegimeTypeId": "02",
            "employeeNumber": "111111",
            "satJobRiskId": "4",
            "satPaymentPeriodicityId": "02",
            "integratedDailySalary": 180.96,
            "satPayrollStateId": "GUA"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-06-11T00:00:00",
            "initialPaymentDate": "2023-06-05T00:00:00",
            "finalPaymentDate": "2023-06-11T00:00:00",
            "daysPaid": 7,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "SP01",
                        "concept": "SUELDO",
                        "taxedAmount": 1210.30,
                        "exemptAmount": 0.00
                    },
                    {
                        "earningTypeCode": "010",
                        "code": "SP02",
                        "concept": "PREMIO PUNTUALIDAD",
                        "taxedAmount": 121.03,
                        "exemptAmount": 0.00
                    },
                    {
                        "earningTypeCode": "029",
                        "code": "SP03",
                        "concept": "MONEDERO ELECTRONICO",
                        "taxedAmount": 0.00,
                        "exemptAmount": 269.43
                    },
                    {
                        "earningTypeCode": "010",
                        "code": "SP04",
                        "concept": "PREMIO DE ASISTENCIA",
                        "taxedAmount": 121.03,
                        "exemptAmount": 0.00
                    },
                    {
                        "earningTypeCode": "005",
                        "code": "SP54",
                        "concept": "APORTACION FONDO AHORRO",
                        "taxedAmount": 0.00,
                        "exemptAmount": 121.03
                    }
                ],
                "otherPayments": [
                    {
                        "otherPaymentTypeCode": "002",
                        "code": "ISRSUB",
                        "concept": "Subsidio ISR para empleo",
                        "amount": 0.0,
                        "subsidyCaused": 0.0,
                        "balanceCompensation": {
                            "favorableBalance": 0.0,
                            "year": 2022,
                            "remainingFavorableBalance": 0.0
                        }
                    }
                ]
            },
            "deductions": [
                {
                    "deductionTypeCode": "004",
                    "code": "ZA09",
                    "concept": "APORTACION FONDO AHORRO",
                    "amount": 121.03
                },
                {
                    "deductionTypeCode": "002",
                    "code": "ISR",
                    "concept": "ISR",
                    "amount": 36.57
                },
                {
                    "deductionTypeCode": "001",
                    "code": "IMSS",
                    "concept": "Cuota de Seguridad Social EE",
                    "amount": 30.08
                },
                {
                    "deductionTypeCode": "004",
                    "code": "ZA68",
                    "concept": "DEDUCCION FDO AHORRO PAT",
                    "amount": 121.03
                },
                {
                    "deductionTypeCode": "018",
                    "code": "ZA11",
                    "concept": "APORTACION CAJA AHORRO",
                    "amount": 300.00
                }
            ]
        }
    }
}'

### Factura Nómina - Nómina Con Horas Extra

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01",
            "seniority": "P437W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "03",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "04",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "baseSalaryForContributions": 490.22,
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-05-24T00:00:00",
            "initialPaymentDate": "2023-05-09T00:00:00",
            "finalPaymentDate": "2023-05-24T00:00:00",
            "daysPaid": 15,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "00500",
                        "concept": "Sueldos, Salarios Rayas y Jornales",
                        "taxedAmount": 2808.8,
                        "exemptAmount": 2191.2
                    },
                    {
                        "earningTypeCode": "019",
                        "code": "00100",
                        "concept": "Horas Extra",
                        "taxedAmount": 50.00,
                        "exemptAmount": 50.00,
                        "overtime": [
                            {
                                "days": 1,
                                "hoursTypeCode": "01",
                                "extraHours": 2,
                                "amountPaid": 100.00
                            }
                        ]
                    }
                ],
                "otherPayments": []
            },
            "deductions": [
                {
                    "deductionTypeCode": "001",
                    "code": "00301",
                    "concept": "Seguridad Social",
                    "amount": 200
                },
                {
                    "deductionTypeCode": "002",
                    "code": "00302",
                    "concept": "ISR",
                    "amount": 100
                }
            ]
        }
    }
}'

### Factura Nómina - Nómina Con Incapacidades
curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01T00:00:00",
            "seniority": "P437W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "03",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "04",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "baseSalaryForContributions": 490.22,
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-05-24T00:00:00",
            "initialPaymentDate": "2023-05-09T00:00:00",
            "finalPaymentDate": "2023-05-24T00:00:00",
            "daysPaid": 15,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "00500",
                        "concept": "Sueldos, Salarios Rayas y Jornales",
                        "taxedAmount": 2808.8,
                        "exemptAmount": 2191.2
                    }
                ]
            },
            "deductions": [
                {
                    "deductionTypeCode": "001",
                    "code": "00301",
                    "concept": "Seguridad Social",
                    "amount": 200
                },
                {
                    "deductionTypeCode": "002",
                    "code": "00302",
                    "concept": "ISR",
                    "amount": 100
                }
            ],
            "disabilities": [
                {
                    "disabilityDays": 1,
                    "disabilityTypeCode": "01"
                }
            ]
        }
    }
}'

### Factura Nómina - Nómina con SNCF

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "39074",
    "exportCode": "01",
    "issuer": {
        "tin": "OÑO120726RX3",
        "legalName": "ORGANICOS ÑAVEZ OSORIO",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "27112029",
            "satFundSourceId": "IP"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "CACX7605101P8",
        "legalName": "XOCHILT CASAS CHAVEZ",
        "zipCode": "36257",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "80997742673",
            "laborRelationStartDate": "2021-09-01",
            "seniority": "P88W",
            "satContractTypeId": "01",
            "satTaxRegimeTypeId": "02",
            "employeeNumber": "273",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "04",
            "integratedDailySalary": 221.48,
            "satPayrollStateId": "GRO"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-05-16T00:00:00",
            "initialPaymentDate": "2023-05-01T00:00:00",
            "finalPaymentDate": "2023-05-16T00:00:00",
            "daysPaid": 15,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "P001",
                        "concept": "Sueldos, Salarios Rayas y Jornales",
                        "taxedAmount": 3322.20,
                        "exemptAmount": 0.0
                    },
                    {
                        "earningTypeCode": "038",
                        "code": "P540",
                        "concept": "Compensacion",
                        "taxedAmount": 100.0,
                        "exemptAmount": 0.0
                    },
                    {
                        "earningTypeCode": "038",
                        "code": "P550",
                        "concept": "Compensación Garantizada Extraordinaria",
                        "taxedAmount": 2200.0,
                        "exemptAmount": 0.0
                    },
                    {
                        "earningTypeCode": "038",
                        "code": "P530",
                        "concept": "Servicio Extraordinario",
                        "taxedAmount": 200.0,
                        "exemptAmount": 0.0
                    },
                    {
                        "earningTypeCode": "001",
                        "code": "P506",
                        "concept": "Otras Prestaciones",
                        "taxedAmount": 1500.0,
                        "exemptAmount": 0.0
                    },
                    {
                        "earningTypeCode": "001",
                        "code": "P505",
                        "concept": "Remuneración al Desempeño Legislativo",
                        "taxedAmount": 17500.0,
                        "exemptAmount": 0.0
                    }
                ],
                "otherPayments": [
                    {
                        "otherPaymentTypeCode": "002",
                        "code": "o002",
                        "concept": "Subsidio para el empleo efectivamente entregado al trabajador",
                        "amount": 0.0,
                        "subsidyCaused": 0.0
                    }
                ]
            },
            "deductions": [
                {
                    "deductionTypeCode": "002",
                    "code": "D002",
                    "concept": "ISR",
                    "amount": 4716.61
                },
                {
                    "deductionTypeCode": "004",
                    "code": "D525",
                    "concept": "Redondeo",
                    "amount": 0.81
                },
                {
                    "deductionTypeCode": "001",
                    "code": "D510",
                    "concept": "Cuota Trabajador ISSSTE",
                    "amount": 126.78
                }
            ]
        }
    }
}'

### Factura Nómina - Nómina Extraordinaria

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01",
            "seniority": "P439W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "03",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "99",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "E",
            "paymentDate": "2023-06-04T00:00:00",
            "initialPaymentDate": "2023-06-04T00:00:00",
            "finalPaymentDate": "2023-06-04T00:00:00",
            "daysPaid": 30,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "002",
                        "code": "00500",
                        "concept": "Gratificación Anual (Aguinaldo)",
                        "taxedAmount": 0.00,
                        "exemptAmount": 10000.00
                    }
                ],
                "otherPayments": []
            },
            "deductions": []
        }
    }
}'

### Factura Nómina - Nómina Separación Indemnización

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
  "versionCode": "4.0",
  "series": "F",
  "date": "2026-01-18T18:04:06",
  "paymentMethodCode": "PUE",
  "currencyCode": "MXN",
  "typeCode": "N",
  "expeditionZipCode": "20000",
  "exportCode": "01",
  "issuer": {
    "tin": "EKU9003173C9",
    "legalName": "ESCUELA KEMPER URGATE",
    "taxRegimeCode": "601",
    "employerData": {
      "employerRegistration": "B5510768108",
      "originEmployerTin": "URE180429TM6"
    },
    "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
  },
  "recipient": {
    "tin": "XOJI740919U48",
    "legalName": "INGRID XODAR JIMENEZ",
    "zipCode": "76028",
    "taxRegimeCode": "605",
    "cfdiUseCode": "CN01",
    "employeeData": {
      "curp": "XEXX010101HNEXXXA4",
      "socialSecurityNumber": "000000",
      "laborRelationStartDate": "2015-01-01",
      "seniority": "P439W",
      "satContractTypeId": "01",
      "satWorkdayTypeId": "01",
      "satTaxRegimeTypeId": "03",
      "employeeNumber": "120",
      "department": "Desarrollo",
      "position": "Ingeniero de Software",
      "satJobRiskId": "1",
      "satPaymentPeriodicityId": "99",
      "satBankId": "002",
      "bankAccount": "1111111111",
      "integratedDailySalary": 146.47,
      "satPayrollStateId": "JAL"
    }
  },
  "complement": {
    "payroll": {
      "version": "1.2",
      "payrollTypeCode": "E",
      "paymentDate": "2023-06-04T00:00:00",
      "initialPaymentDate": "2023-05-05T00:00:00",
      "finalPaymentDate": "2023-06-04T00:00:00",
      "daysPaid": 30,
      "earnings": {
        "earnings": [
          {
            "earningTypeCode": "023",
            "code": "00500",
            "concept": "Pagos por separación",
            "taxedAmount": 0.00,
            "exemptAmount": 10000.00
          },
          {
            "earningTypeCode": "025",
            "code": "00900",
            "concept": "Indemnizaciones",
            "taxedAmount": 0.00,
            "exemptAmount": 500.00
          }
        ],
        "otherPayments": [],
        "severance": {
          "totalPaid": 10500.00,
          "yearsOfService": 1,
          "lastMonthlySalary": 10000.00,
          "accumulableIncome": 10000.00,
          "nonAccumulableIncome": 0.00
        }
      },
      "deductions": []
    }
  }
}'


### Factura Nómina - Nómina Jubilación Pensión Retiro
curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01",
            "seniority": "P439W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "03",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "99",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "E",
            "paymentDate": "2023-05-05T00:00:00",
            "initialPaymentDate": "2023-06-04T00:00:00",
            "finalPaymentDate": "2023-06-04T00:00:00",
            "daysPaid": 30,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "039",
                        "code": "00500",
                        "concept": "Jubilaciones, pensiones o haberes de retiro",
                        "taxedAmount": 0.00,
                        "exemptAmount": 10000.00
                    }
                ],
                "retirement": {
                    "totalOneTime": 10000.00,
                    "accumulableIncome": 10000.00,
                    "nonAccumulableIncome": 0.00
                }
            },
            "deductions": []
        }
    }
}'

### Factura Nómina - Nómina Sin Deducciones

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01",
            "seniority": "P437W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "03",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "04",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "baseSalaryForContributions": 490.22,
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-05-24T00:00:00",
            "initialPaymentDate": "2023-05-09T00:00:00",
            "finalPaymentDate": "2023-05-24T00:00:00",
            "daysPaid": 15,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "00500",
                        "concept": "Sueldos, Salarios Rayas y Jornales",
                        "taxedAmount": 2808.8,
                        "exemptAmount": 2191.2
                    }
                ],
                "otherPayments": []
            },
            "deductions": []
        }
    }
}'


### Factura Nómina - Nómina Subsidio causado al empleo

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01T00:00:00",
            "seniority": "P437W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "02",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "04",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "baseSalaryForContributions": 490.22,
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-05-24T00:00:00",
            "initialPaymentDate": "2023-05-09T00:00:00",
            "finalPaymentDate": "2023-05-24T00:00:00",
            "daysPaid": 15,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "00500",
                        "concept": "Sueldos, Salarios Rayas y Jornales",
                        "taxedAmount": 2808.8,
                        "exemptAmount": 2191.2
                    }
                ],
                "otherPayments": [
                    {
                        "otherPaymentTypeCode": "007",
                        "code": "0002",
                        "concept": "ISR ajustado por subsidio",
                        "amount": 145.80,
                        "subsidyCaused": 0.0
                    }
                ]
            },
            "deductions": [
                {
                    "deductionTypeCode": "107",
                    "code": "D002",
                    "concept": "Ajuste al Subsidio Causado",
                    "amount": 160.35
                },
                {
                    "deductionTypeCode": "002",
                    "code": "D002",
                    "concept": "ISR",
                    "amount": 145.80
                }
            ]
        }
    }
}'

### Factura Nómina - Nómina Viáticos

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01T00:00:00",
            "seniority": "P438W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "03",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "04",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "baseSalaryForContributions": 490.22,
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-09-26T00:00:00",
            "initialPaymentDate": "2023-09-11T00:00:00",
            "finalPaymentDate": "2023-09-26T00:00:00",
            "daysPaid": 15,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "050",
                        "code": "050",
                        "concept": "Viaticos",
                        "taxedAmount": 0,
                        "exemptAmount": 3000
                    }
                ]
            },
            "deductions": [
                {
                    "deductionTypeCode": "081",
                    "code": "081",
                    "concept": "Ajuste en viaticos entregados al trabajador",
                    "amount": 3000
                }
            ]
        }
    }
}'

### Factura Nómina - Nómina

curl --location 'http://localhost:5001/api/v4/invoices' \
--header 'X-TENANT-KEY: 102e5f13-e114-41dd-bea7-507fce177281' \
--header 'X-TIME-ZONE: America/Mexico_City' \
--header 'Content-Type: application/json' \
--header 'X-API-KEY: sk_development_b470ea83_3c0f_4209_b933_85223b960d91' \
--data '{
    "versionCode": "4.0",
    "series": "F",
    "date": "2026-01-18T18:04:06",
    "paymentMethodCode": "PUE",
    "currencyCode": "MXN",
    "typeCode": "N",
    "expeditionZipCode": "20000",
    "exportCode": "01",
    "issuer": {
        "tin": "EKU9003173C9",
        "legalName": "ESCUELA KEMPER URGATE",
        "taxRegimeCode": "601",
        "employerData": {
            "employerRegistration": "B5510768108",
            "originEmployerTin": "URE180429TM6"
        },
        "taxCredentials": [
            {
                "base64File": "base64cer...",
                "fileType": 0,
                "password": "12345678a"
            },
            {
                "base64File": "base64key...",
                "fileType": 1,
                "password": "12345678a"
            }
        ]
    },
    "recipient": {
        "tin": "XOJI740919U48",
        "legalName": "INGRID XODAR JIMENEZ",
        "zipCode": "76028",
        "taxRegimeCode": "605",
        "cfdiUseCode": "CN01",
        "employeeData": {
            "curp": "XEXX010101HNEXXXA4",
            "socialSecurityNumber": "000000",
            "laborRelationStartDate": "2015-01-01T00:00:00",
            "seniority": "P437W",
            "satContractTypeId": "01",
            "satWorkdayTypeId": "01",
            "satTaxRegimeTypeId": "03",
            "employeeNumber": "120",
            "department": "Desarrollo",
            "position": "Ingeniero de Software",
            "satJobRiskId": "1",
            "satPaymentPeriodicityId": "04",
            "satBankId": "002",
            "bankAccount": "1111111111",
            "baseSalaryForContributions": 490.22,
            "integratedDailySalary": 146.47,
            "satPayrollStateId": "JAL"
        }
    },
    "complement": {
        "payroll": {
            "version": "1.2",
            "payrollTypeCode": "O",
            "paymentDate": "2023-05-24T00:00:00",
            "initialPaymentDate": "2023-05-09T00:00:00",
            "finalPaymentDate": "2023-05-24T00:00:00",
            "daysPaid": 15,
            "earnings": {
                "earnings": [
                    {
                        "earningTypeCode": "001",
                        "code": "00500",
                        "concept": "Sueldos, Salarios Rayas y Jornales",
                        "taxedAmount": 2808.8,
                        "exemptAmount": 2191.2
                    }
                ],
                "otherPayments": []
            },
            "deductions": [
                {
                    "deductionTypeCode": "001",
                    "code": "00301",
                    "concept": "Seguridad Social",
                    "amount": 200
                },
                {
                    "deductionTypeCode": "002",
                    "code": "00302",
                    "concept": "ISR",
                    "amount": 100
                }
            ]
        }
    }
}'


### Response (for any use case)

{
    "data": {
        "versionCode": "4.0",
        "series": "F",
        "number": "EKU9003173C9-136",
        "date": "2025-10-19T10:25:16.000",
        "paymentFormCode": null,
        "paymentConditions": null,
        "subtotal": 117408.96,
        "discount": 42821.48,
        "currencyCode": "MXN",
        "exchangeRate": 1,
        "total": 74587.48,
        "typeCode": "N",
        "exportCode": "01",
        "uuid": "a25e3739-a0ce-4c12-9ac0-283e035b9bf8",
        "consecutive": 338,
        "status": null,
        "paymentMethodCode": "PUE",
        "expeditionZipCode": "20000",
        "issuer": {
            "id": null,
            "tin": "EKU9003173C9",
            "legalName": "ESCUELA KEMPER URGATE",
            "taxRegimeCode": "601"
        },
        "recipient": {
            "id": null,
            "tin": "FUNK671228PH6",
            "legalName": "KARLA FUENTE NOLASCO",
            "zipCode": "01160",
            "taxRegimeCode": "605",
            "cfdiUseCode": "CN01",
            "email": null
        },
        "items": [
            {
                "itemCode": "84111505",
                "quantity": 1,
                "unitOfMeasurementCode": "ACT",
                "description": "Pago de nómina",
                "unitPrice": 117408.96,
                "taxObjectCode": "01",
                "itemSku": null,
                "unitOfMeasurement": null,
                "discount": 42821.48,
                "itemTaxes": []
            }
        ],
        "responses": [
            {
                "invoiceId": "00c6f323-cf1d-4192-b3d0-eae33202a17a",
                "invoiceUuid": "a25e3739-a0ce-4c12-9ac0-283e035b9bf8",
                "invoiceCertificateNumber": "30001000000500003416",
                "invoiceBase64Sello": "base64...",
                "invoiceSignatureDate": "2025-10-20T12:56:42.000",
                "invoiceBase64QrCode": "base64...",
                "invoiceBase64": "base64...",
                "satBase64Sello": "base64...",
                "satBase64OriginalString": "base64...",
                "satCertificateNumber": "30001000000500003456",
                "id": "493f66c5-e366-485b-a3ce-1927e3d59710",
                "createdAt": "2025-10-20T12:56:41.840",
                "updatedAt": "2025-10-20T12:56:41.840"
            }
        ],
        "metadata": {
            "mode": "values"
        },
        "id": "00c6f323-cf1d-4192-b3d0-eae33202a17a",
        "createdAt": "2025-10-20T12:56:41.840",
        "updatedAt": "2025-10-20T12:56:41.840"
    },
    "succeeded": true,
    "message": "",
    "details": "",
    "httpStatusCode": 200
}






## Facturas de nomina por referencias.

Analyze the existing **13 value-based payroll invoice examples** (where all data is sent via the request body) on @ejemplos-factura-nomina.ts file

**Task:**
Recreate these 13 examples using a **reference-based approach**. In this approach, the Issuer (*Emisor*) and Receiver (*Receptor*) are referenced by their Object IDs rather than embedding their full details in the invoice payload.

**Constants:**
Map the entities to the following UUIDs:

```typescript
const escuelaKemperUrgateId = "2e7b988f-3a2a-4f67-86e9-3f931dd48581";
const karlaFuenteNolascoId = "109f4d94-63ea-4a21-ab15-20c8b87d8ee9";
const organicosNavezOsorioId = "f645e146-f80e-40fa-953f-fd1bd06d4e9f";
const xochiltCasasChavezId = "e3b4edaa-e4d9-4794-9c5b-3dd5b7e372aa";
const ingridXodarJimenezId = "9367249f-f0ee-43f4-b771-da2fff3f185f";

```

**Requirements:**
For each of the 13 use cases, you must generate **two distinct operations**:

1. **Configuration (Setup):** Create the code to configure/save the Employee and Employer objects first.
* *Crucial:* You must extract the specific attributes (name, RFC, fiscal regime, etc.) from the original value-based example to populate these objects correctly.


2. **Invoice Generation (Execution):** Create the payroll invoice request using the IDs defined above (referencing the objects created in step 1).
* *Note:* The "Payroll Complement" data (amounts, perceptions, deductions) must remain identical to the original examples.

3. Add those samples to the main function to be executable uncommeting them as needed, follow the same patter that the by values version.


Example 

// ============================================================================
// 1. NOMINA ORDINARIA (Facturación por referencias)
// ============================================================================
async function nominaOrdinariaByReferencesSetupData(client: FiscalapiClient): Promise<void> {
    // fiscalapiClient.persons.employer.delete(<id>)
    // fiscalapiClient.persons.employer.create({...})
    // fiscalapiClient.persons.employee.delete(<id>)
    // fiscalapiClient.persons.employee.create({...})
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
      id: escuelaKemperUrgateId, //legalName: 'ESCUELA KEMPER URGATE',
    },
    recipient: {
      id: karlaFuenteNolascoId // legalName: 'KARLA FUENTE NOLASCO',
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
