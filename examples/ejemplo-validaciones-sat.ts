/**
 * Validaciones del SAT — GET/POST /api/v4/sat-validations
 *
 * Verifica un CFDI timbrado contra los servicios oficiales del SAT: estructura del XML,
 * vigencia del certificado, sellos, estado del comprobante y listas negras 69-B / 69-B Bis.
 *
 * Cada tipo de validación solicitado consume un crédito de validación. El cobro es todo o nada
 * y ocurre antes de ejecutar: si el saldo no alcanza para todos, no se ejecuta ninguno.
 */
import * as fs from 'fs';
import {
  ApiResponse,
  encodeToBase64,
  FiscalapiClient,
  FiscalapiSettings,
  IFiscalapiClient,
  Person,
  SatValidationRequest,
  SatValidationResult,
  SatValidationStatusIds,
  SatValidationType,
  SatValidationTypeIds,
  SatValidationTypeStatus,
} from '../src/index';

// Configuración de FiscalAPI
const settings: FiscalapiSettings = {
  apiUrl: 'https://test.fiscalapi.com', // https://live.fiscalapi.com
  apiKey: '<api-key>', // API key de FiscalAPI
  tenant: '<tenant>', // Tenant de FiscalAPI
  debug: true // true, imprime raw request y response en consola, util durante el desarrollo de la integración.
};

// Id de la persona emisora, para consultar su saldo de créditos de validación
const personId: string = '<person-id>';

// Ruta del CFDI timbrado que se desea validar.
// Las validaciones de estructura, certificado, sellos y estado requieren un CFDI timbrado
// (con complemento TimbreFiscalDigital); si no lo tiene, esos tipos devuelven Omitido.
const rutaCfdi: string = 'C:/facturas/FacturaXml.xml';

/**
 * Imprime los resultados de una ejecución de validaciones.
 * @param {SatValidationResult[]} resultados - Resultados devueltos por la API
 */
function imprimirResultados(resultados: SatValidationResult[]): void {
  resultados.forEach((resultado: SatValidationResult) => {
    const veredicto: string = resultado.passed ? 'PASÓ' : 'NO PASÓ';
    console.log(`[${veredicto}] ${resultado.type.id} -> ${resultado.status.id}`);

    // details es texto libre en español y puede venir nulo. No tiene formato garantizado.
    if (resultado.status.details) {
      console.log(`         ${resultado.status.details}`);
    }

    // NoDisponible significa que el servicio externo no respondió: conviene reintentar.
    if (resultado.status.id === SatValidationStatusIds.NoDisponible) {
      console.log('         El servicio del SAT no respondió. Reintentar más tarde.');
    }
  });
}

// ============================================================
// 1. Listar los tipos de validación disponibles
// ============================================================
async function listarTipos(client: IFiscalapiClient): Promise<void> {
  const respuesta: ApiResponse<SatValidationType[]> = await client.satValidations.getTypes();
  console.log('Tipos de validación:', respuesta);

  if (respuesta.succeeded) {
    respuesta.data.forEach((tipo: SatValidationType) => {
      console.log(`- ${tipo.id}: ${tipo.description}`);
    });
  }
}

// ============================================================
// 2. Obtener un tipo de validación por su id
// ============================================================
async function obtenerTipo(client: IFiscalapiClient): Promise<void> {
  const respuesta: ApiResponse<SatValidationType> = await client.satValidations.getTypeById(
    SatValidationTypeIds.CfdiStatus
  );
  console.log('Tipo de validación:', respuesta);
}

// ============================================================
// 3. Consultar los estatus que un tipo puede tomar al ejecutarse
//    Sólo lectura: no ejecuta el validador ni consume crédito.
// ============================================================
async function listarEstatus(client: IFiscalapiClient): Promise<void> {
  const respuesta: ApiResponse<SatValidationTypeStatus[]> = await client.satValidations.getStatuses(
    SatValidationTypeIds.CfdiStatus
  );
  console.log('Estatus posibles:', respuesta);

  if (respuesta.succeeded) {
    respuesta.data.forEach((estatus: SatValidationTypeStatus) => {
      console.log(`- ${estatus.id}: ${estatus.description}`);
    });
  }
}

// ============================================================
// 4. Validar un CFDI: con xml se puede solicitar cualquier tipo
// ============================================================
async function validarCfdi(client: IFiscalapiClient): Promise<void> {
  // El CFDI viaja en base64. Se lee el archivo como texto y se codifica con el util del SDK.
  const xmlCfdi: string = fs.readFileSync(rutaCfdi, 'utf8');

  const request: SatValidationRequest = {
    xml: encodeToBase64(xmlCfdi),
    validationTypes: [
      SatValidationTypeIds.XmlStructure,
      SatValidationTypeIds.CertificateValidity,
      SatValidationTypeIds.CfdiSello,
      SatValidationTypeIds.TfdSello,
      SatValidationTypeIds.CfdiStatus,
      SatValidationTypeIds.Blacklist69B,
      SatValidationTypeIds.Blacklist69BBis,
    ],
  };

  const respuesta: ApiResponse<SatValidationResult[]> = await client.satValidations.validate(request);
  console.log('Validaciones del CFDI:', respuesta);

  if (respuesta.succeeded) {
    // Los resultados vienen en el orden del catálogo, no en el orden solicitado.
    imprimirResultados(respuesta.data);

    // Un resultado adverso NO es un error de la petición: un CFDI con sello inválido
    // responde 200 con succeeded true. El veredicto de cada validación es passed.
    const fallidas: SatValidationResult[] = respuesta.data.filter(
      (resultado: SatValidationResult) => !resultado.passed
    );
    console.log(`Validaciones no aprobadas: ${fallidas.length} de ${respuesta.data.length}`);
  }
}

// ============================================================
// 5. Validar sólo un RFC contra las listas negras
//    Con tin (sin xml) únicamente se pueden solicitar listas negras.
// ============================================================
async function validarRfc(client: IFiscalapiClient): Promise<void> {
  const request: SatValidationRequest = {
    tin: 'XAXX010101000',
    validationTypes: [
      SatValidationTypeIds.Blacklist69B,
      SatValidationTypeIds.Blacklist69BBis,
    ],
  };

  const respuesta: ApiResponse<SatValidationResult[]> = await client.satValidations.validate(request);
  console.log('Validaciones del RFC:', respuesta);

  if (respuesta.succeeded) {
    imprimirResultados(respuesta.data);
  }
}

// ============================================================
// 6. Manejo de errores
//    El SDK no lanza excepciones ante errores de la API: siempre revisa succeeded.
//    Este caso pide un tipo que exige xml enviando únicamente tin: responde 400 y no cobra créditos.
// ============================================================
async function manejarError(client: IFiscalapiClient): Promise<void> {
  const request: SatValidationRequest = {
    tin: 'XAXX010101000',
    validationTypes: [SatValidationTypeIds.CfdiStatus],
  };

  const respuesta: ApiResponse<SatValidationResult[]> = await client.satValidations.validate(request);

  if (!respuesta.succeeded) {
    console.log('Código HTTP:', respuesta.httpStatusCode);
    console.log('Mensaje:', respuesta.message);
    console.log('Detalles:', respuesta.details);

    // Sólo viene en respuestas de error. Es el dato que soporte necesita para rastrear el fallo.
    console.log('Trace:', respuesta.traceIdentifier);
  }
}

// ============================================================
// 7. Consultar el saldo de créditos de validación
// ============================================================
async function consultarSaldo(client: IFiscalapiClient): Promise<void> {
  const respuesta: ApiResponse<Person> = await client.persons.getById(personId);

  if (respuesta.succeeded) {
    const persona: Person = respuesta.data;
    console.log('Timbres disponibles:', persona.availableBalance);
    console.log('Validaciones disponibles:', persona.availableValidationBalance);
  }
}

async function main(): Promise<void> {
  const client: IFiscalapiClient = FiscalapiClient.create(settings);

  try {
    await listarTipos(client);
    await obtenerTipo(client);
    await listarEstatus(client);

    // Las siguientes consumen créditos de validación (uno por tipo solicitado).
    await validarCfdi(client);
    await validarRfc(client);

    await manejarError(client);
    await consultarSaldo(client);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
