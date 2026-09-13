/**
 * Ejemplos de facturas con complemento Comercio Exterior (CFDI 4.0) usando el SDK de FiscalAPI
 * Todos los métodos usan el modo "ByReferences": emisor, receptor y productos se envían solo con su `id`.
 * Cada caso de uso expone dos funciones:
 *   - <nombre>UpdatePeople     : actualiza emisor y receptor en FiscalAPI con sus datos completos.
 *   - <nombre>PorReferencias   : invoca UpdatePeople y luego crea la factura referenciando solo los ids.
 *
 * Al referenciar un producto por `id`, el CFDI toma de él la clave del SAT, la unidad, la descripción,
 * el precio y los impuestos; el `itemSku` del concepto se ignora y `NoIdentificacion` pasa a ser el id
 * del producto. Por eso las mercancías del complemento apuntan a ese mismo id.
 *
 * Dos casos de traslado envían sus conceptos en línea y no por referencia: un producto registrado exige
 * precio unitario mayor que cero, y un concepto no puede bajarlo a cero, que es lo que esos CFDI requieren.
 *
 * Pre-requisito: los certificados CSD (.cer y .key) del emisor deben estar previamente cargados
 * en el dashboard de FiscalAPI para `issuerId`. Estos ejemplos NO los suben.
 */

import {
  ApiResponse,
  ComercioExteriorComplement,
  ComercioExteriorEmisor,
  ComercioExteriorEmisorDomicilio,
  ComercioExteriorMercancia,
  ComercioExteriorReceptor,
  ComercioExteriorReceptorDomicilio,
  Complement,
  FileResponse,
  FiscalapiClient,
  FiscalapiSettings,
  decodeFromBase64,
  formatSatDate,
  IFiscalapiClient,
  Invoice,
  InvoiceItem,
  InvoiceIssuer,
  InvoiceRecipient,
  ItemTax,
  LadingComplement,
  Person
} from '../src/index';
import { inspect } from 'util';
import { DateTime } from 'luxon';
import * as fs from 'fs';
import * as path from 'path';

// Configuración de la consola para mostrar objetos anidados
inspect.defaultOptions.depth = null;
inspect.defaultOptions.colors = true;

// Configuración de FiscalAPI
const settings: FiscalapiSettings = {
    apiUrl: 'https://test.fiscalapi.com', // https://live.fiscalapi.com
    apiKey: '<API_KEY>', // API key de FiscalAPI
    tenant: '<TENANT_KEY>', // Tenant de FiscalAPI
    debug: true // true, imprime raw request y response en consola, util durante el desarrollo de la integración.
};

// Fecha dinámica para los CFDI generados
const currentDate: string = formatSatDate(DateTime.now().setZone('America/Mexico_City'));

// Tipo de cambio USD del complemento. Debe coincidir con el publicado en el DOF para la fecha del CFDI,
// de lo contrario el SAT rechaza el comprobante con CCE121. Se envía como string para conservar los 4 decimales.
const tipoCambioUsdDof: string = '16.9722';

// IDs de personas previamente registradas en FiscalAPI (emisor y receptor)
const issuerId: string = '<issuer-id>';
const recipientId: string = '<recipient-id>';

// IDs de productos previamente registrados en FiscalAPI.
// Al referenciar un producto por id, el CFDI toma de el la clave, unidad, descripcion,
// precio e impuestos, y NoIdentificacion pasa a ser el id del producto: por eso las
// mercancias del complemento apuntan al mismo id y no al SKU.
const productoFlete: string = '<producto-flete-id>';
const productoGomitas: string = '<producto-gomitas-id>';
const productoPulparindo: string = '<producto-pulparindo-id>';
const productoCigarrosIvaIsrIvaRetenido: string = '<producto-cigarros-iva-isr-ivaret-id>';
const productoCigarrosIvaIsr: string = '<producto-cigarros-iva-isr-id>';
const productoCigarrosTraslado: string = '<producto-cigarros-traslado-id>';
const productoFormulaMagistral: string = '<producto-formula-magistral-id>';
const productoBebida: string = '<producto-bebida-id>';

// Carpeta donde se guardan los XML timbrados que devuelve la API
const carpetaSalida: string = 'C:/facturas';

/**
 * Descarga el XML timbrado, lo guarda en disco e imprime los atributos cuya escala decimal
 * valida el SAT. Si la escala se pierde el comprobante es rechazado: CCE122 en TotalUSD,
 * CFDI40179 en TasaOCuota. Por eso los campos decimales se envían como string.
 */
async function verificarCfdiTimbrado(client: IFiscalapiClient, invoiceId: string): Promise<void> {
  const xmlResponse: ApiResponse<FileResponse> = await client.invoices.getXml(invoiceId);

  if (!xmlResponse.succeeded || !xmlResponse.data.base64File) {
    console.log('No se pudo descargar el XML:', xmlResponse.message);
    return;
  }

  const xml: string = decodeFromBase64(xmlResponse.data.base64File);

  if (!fs.existsSync(carpetaSalida)) {
    fs.mkdirSync(carpetaSalida, { recursive: true });
  }

  const rutaXml: string = path.join(carpetaSalida, xmlResponse.data.fileName || invoiceId + '.xml');
  fs.writeFileSync(rutaXml, xml, 'utf8');
  console.log('XML timbrado guardado en:', rutaXml);

  const atributosConEscala: string[] = [
    'TipoCambioUSD', 'TotalUSD', 'CantidadAduana', 'ValorUnitarioAduana', 'ValorDolares', 'TasaOCuota'
  ];

  atributosConEscala.forEach((atributo: string) => {
    const coincidencias: RegExpMatchArray | null = xml.match(new RegExp(atributo + '="[^"]*"', 'g'));
    if (coincidencias !== null) {
      console.log('  ' + coincidencias.join('  '));
    }
  });
}

// ============================================================================
// 1. FACTURA CE INGRESO CON CARTA PORTE 31 (Facturación por referencias)
// ============================================================================
async function facturaCEIngresoConCartaPorte31UpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'XEXX010101000',
    legalName: 'Persona Fisica Extranjera',
    email: 'persona.fisica.extranjera@example.com',
    zipCode: '42501',
    satTaxRegimeId: '616',
    satCfdiUseId: 'S01',
    countryId: 'USA',
    foreignTin: '123456789'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCEIngresoConCartaPorte31PorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Ingreso Con Carta Porte 31 (Por Referencias) ===\n');

  await facturaCEIngresoConCartaPorte31UpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    { id: productoFlete, quantity: 1.0 },
    { id: productoGomitas, quantity: 1.0 },
    { id: productoPulparindo, quantity: 1.0 }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'Av Siempre viva',
      numeroExterior: '123',
      coloniaId: '0001',
      localidadId: '06',
      municipioId: '025',
      estadoId: 'COA',
      paisId: 'MEX',
      codigoPostalId: '26015'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    numRegIdTrib: '123456789',
    domicilio: {
      calle: 'Clinton ST',
      numeroExterior: '10002',
      estado: 'NY',
      paisId: 'USA',
      codigoPostal: '10002-0000'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: productoGomitas,
      fraccionArancelariaId: '4011101099',
      cantidadAduana: '1.000',
      unidadAduanaId: '06',
      valorUnitarioAduana: '120.00',
      valorDolares: '120.00'
    },
    {
      noIdentificacion: productoPulparindo,
      fraccionArancelariaId: '8407210299',
      cantidadAduana: '1.000',
      unidadAduanaId: '06',
      valorUnitarioAduana: '100.00',
      valorDolares: '100.00'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'CIF',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const cartaPorte: LadingComplement = {
    transpInternacId: 'Sí',
    entradaSalidaMercId: 'Salida',
    paisOrigenDestinoId: 'ALB',
    viaEntradaSalidaId: '01',
    totalDistRec: 120.00,
    unidadPesoId: 'KGM',
    regimenAduaneros: [
      { regimenAduaneroId: 'EXD' }
    ],
    ubicaciones: [
      {
        tipoUbicacion: 'Origen',
        idUbicacion: 'OR000001',
        rfcRemitenteDestinatario: 'XAXX010101000',
        nombreRemitenteDestinatario: 'Origen Nacional',
        fechaHoraSalidaLlegada: '2026-04-27T08:00:00',
        domicilio: {
          calle: 'xola',
          numeroExterior: '531',
          coloniaId: '0496',
          localidadId: '03',
          municipioId: '014',
          estadoId: 'CMX',
          paisId: 'MEX',
          codigoPostalId: '03100'
        }
      },
      {
        tipoUbicacion: 'Destino',
        idUbicacion: 'DE000001',
        rfcRemitenteDestinatario: 'XAXX010101000',
        nombreRemitenteDestinatario: 'Destino Nacional',
        fechaHoraSalidaLlegada: '2026-04-27T20:00:00',
        distanciaRecorrida: 120.00,
        domicilio: {
          calle: 'Av Coyoacan',
          numeroExterior: '120',
          coloniaId: '2624',
          localidadId: '03',
          municipioId: '014',
          estadoId: 'CMX',
          paisId: 'MEX',
          codigoPostalId: '03100'
        }
      }
    ],
    mercancias: [
      {
        bienesTranspId: '50433238',
        descripcion: 'Gomitas',
        cantidad: 1,
        claveUnidadId: 'XPK',
        pesoEnKg: 10.000,
        valorMercancia: 1200.00,
        monedaId: 'USD',
        fraccionArancelariaId: '2005800100',
        tipoMateriaId: '04'
      },
      {
        bienesTranspId: '50433238',
        descripcion: 'Pulparindo',
        cantidad: 1,
        claveUnidadId: 'XPK',
        pesoEnKg: 10.000,
        valorMercancia: 1000.00,
        monedaId: 'USD',
        fraccionArancelariaId: '2005800100',
        tipoMateriaId: '04'
      }
    ],
    autotransporte: {
      permSCTId: 'TPAF02',
      numPermisoSCT: '123456',
      configVehicularId: 'C2',
      pesoBrutoVehicular: 1,
      placaVM: '555TTT',
      anioModeloVM: 2023,
      aseguraRespCivil: 'ODISEA',
      polizaRespCivil: '3456YUHNB234RT'
    },
    tiposFigura: [
      {
        tipoFiguraId: '01',
        rfcFigura: 'KAHO641101B39',
        numLicencia: 'D0908240',
        nombreFigura: 'OSCAR KALA HAAK'
      }
    ]
  };

  const complement: Complement = {
    cartaPorte: cartaPorte,
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '99',
    paymentMethodCode: 'PUE',
    currencyCode: 'USD',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    paymentConditions: 'CondicionesDePago',
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 2. FACTURA CE INGRESO DIFERENTES MONEDAS (Facturación por referencias)
// ============================================================================
async function facturaCEIngresoDiferentesMonedasUpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'XEXX010101000',
    legalName: 'Persona Fisica Extranjera',
    email: 'persona.fisica.extranjera@example.com',
    zipCode: '42501',
    satTaxRegimeId: '616',
    satCfdiUseId: 'S01',
    countryId: 'USA',
    foreignTin: '123456789'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCEIngresoDiferentesMonedasPorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Ingreso Diferentes Monedas (Por Referencias) ===\n');

  await facturaCEIngresoDiferentesMonedasUpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    { id: productoCigarrosIvaIsrIvaRetenido, quantity: 2 }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    numRegIdTrib: '123456789',
    domicilio: {
      calle: 'ST. A',
      estado: 'TX',
      paisId: 'USA',
      codigoPostal: '00000'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: productoCigarrosIvaIsrIvaRetenido,
      fraccionArancelariaId: '2402200100',
      cantidadAduana: '2.00',
      unidadAduanaId: '01',
      valorUnitarioAduana: '11.74',
      valorDolares: '23.47'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FOB',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const complement: Complement = {
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '99',
    paymentMethodCode: 'PPD',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    paymentConditions: 'CondicionesDePago',
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 3. FACTURA CE KIT PARTE (Facturación por referencias)
// ============================================================================
async function facturaCEKitParteUpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'XEXX010101000',
    legalName: 'U.S. 0026 SW',
    email: 'us.0026.sw@example.com',
    zipCode: '42501',
    satTaxRegimeId: '616',
    satCfdiUseId: 'CP01',
    countryId: 'USA',
    foreignTin: '123456789'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCEKitPartePorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Kit Parte (Por Referencias) ===\n');

  await facturaCEKitParteUpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    { id: productoFormulaMagistral, quantity: 1.0 },
    { id: productoFormulaMagistral, quantity: 1.0 }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    domicilio: {
      calle: 'ST. A',
      estado: 'TX',
      paisId: 'USA',
      codigoPostal: '00000'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: productoFormulaMagistral,
      fraccionArancelariaId: '2402200100',
      cantidadAduana: '2',
      unidadAduanaId: '01',
      valorUnitarioAduana: '10.00',
      valorDolares: '20.00'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FOB',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const complement: Complement = {
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    paymentConditions: 'CondicionesDePago',
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 4. FACTURA CE RECEPTOR EXTRANJERO (Facturación por referencias)
// ============================================================================
async function facturaCEReceptorExtranjeroUpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'XEXX010101000',
    legalName: 'U.S. 0026 SW',
    email: 'us.0026.sw@example.com',
    zipCode: '42501',
    satTaxRegimeId: '616',
    satCfdiUseId: 'CP01',
    countryId: 'USA',
    foreignTin: '123456789'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCEReceptorExtranjeroPorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Receptor Extranjero (Por Referencias) ===\n');

  await facturaCEReceptorExtranjeroUpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    { id: productoCigarrosIvaIsr, quantity: 2 }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    numRegIdTrib: '123456789',
    domicilio: {
      calle: 'ST. A',
      estado: 'TX',
      paisId: 'USA',
      codigoPostal: '00000'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: productoCigarrosIvaIsr,
      fraccionArancelariaId: '2402200100',
      cantidadAduana: '117.64',
      unidadAduanaId: '01',
      valorUnitarioAduana: '3.40',
      valorDolares: '400.00'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FOB',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const complement: Complement = {
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '99',
    paymentMethodCode: 'PPD',
    currencyCode: 'USD',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    paymentConditions: 'CondicionesDePago',
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 5. FACTURA CE RECEPTOR NACIONAL (Facturación por referencias)
// ============================================================================
async function facturaCEReceptorNacionalUpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'URE180429TM6',
    legalName: 'UNIVERSIDAD ROBOTICA ESPAÑOLA',
    email: 'universidad.robotica.espanola@example.com',
    zipCode: '86991',
    satTaxRegimeId: '601',
    satCfdiUseId: 'G01'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCEReceptorNacionalPorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Receptor Nacional (Por Referencias) ===\n');

  await facturaCEReceptorNacionalUpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    { id: productoCigarrosIvaIsrIvaRetenido, quantity: 2 }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      colonia: '0214',
      localidad: '01',
      municipio: '014',
      estado: 'QUE',
      paisId: 'MEX',
      codigoPostal: '76199'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: productoCigarrosIvaIsrIvaRetenido,
      fraccionArancelariaId: '2402200100',
      cantidadAduana: '117.64',
      unidadAduanaId: '01',
      valorUnitarioAduana: '3.40',
      valorDolares: '400.00'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FOB',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const complement: Complement = {
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '99',
    paymentMethodCode: 'PPD',
    currencyCode: 'USD',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    paymentConditions: 'CondicionesDePago',
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 6. FACTURA CE TRASLADO CON CARTA PORTE 31 (Facturación por referencias)
// ============================================================================
async function facturaCETrasladoConCartaPorte31UpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate.receptor@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601',
    satCfdiUseId: 'S01'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCETrasladoConCartaPorte31PorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Traslado Con Carta Porte 31 (Por Referencias) ===\n');

  await facturaCETrasladoConCartaPorte31UpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    {
      itemCode: '78101800',
      itemSku: 'TR01',
      quantity: 1.0,
      unitOfMeasurementCode: 'H87',
      description: 'TRANSPORTE DE CARGA',
      unitPrice: 0.00,
      discount: 0,
      taxObjectCode: '01',
      itemTaxes: []
    },
    {
      itemCode: '32101622',
      itemSku: 'UT421511',
      quantity: 100.00,
      unitOfMeasurementCode: 'XBX',
      description: 'MEMORIA FLASH',
      unitPrice: 0.00,
      discount: 0,
      taxObjectCode: '01',
      itemTaxes: []
    }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    domicilio: {
      calle: 'ST. A',
      estado: 'TX',
      paisId: 'USA',
      codigoPostal: '00000'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: 'UT421511',
      fraccionArancelariaId: '2402200100',
      cantidadAduana: '100.00',
      unidadAduanaId: '01',
      valorUnitarioAduana: '1.00',
      valorDolares: '0.00'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FOB',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const cartaPorte: LadingComplement = {
    transpInternacId: 'Sí',
    entradaSalidaMercId: 'Salida',
    paisOrigenDestinoId: 'ALB',
    viaEntradaSalidaId: '01',
    totalDistRec: 120.00,
    unidadPesoId: 'KGM',
    regimenAduaneros: [
      { regimenAduaneroId: 'EXD' }
    ],
    ubicaciones: [
      {
        tipoUbicacion: 'Origen',
        idUbicacion: 'OR000001',
        rfcRemitenteDestinatario: 'XAXX010101000',
        nombreRemitenteDestinatario: 'Origen Nacional',
        fechaHoraSalidaLlegada: '2026-04-27T08:00:00',
        domicilio: {
          calle: 'xola',
          numeroExterior: '531',
          coloniaId: '0496',
          localidadId: '03',
          municipioId: '014',
          estadoId: 'CMX',
          paisId: 'MEX',
          codigoPostalId: '03100'
        }
      },
      {
        tipoUbicacion: 'Destino',
        idUbicacion: 'DE000001',
        rfcRemitenteDestinatario: 'XAXX010101000',
        nombreRemitenteDestinatario: 'Destino Nacional',
        fechaHoraSalidaLlegada: '2026-04-27T20:00:00',
        distanciaRecorrida: 120.00,
        domicilio: {
          calle: 'Av Coyoacan',
          numeroExterior: '120',
          coloniaId: '2624',
          localidadId: '03',
          municipioId: '014',
          estadoId: 'CMX',
          paisId: 'MEX',
          codigoPostalId: '03100'
        }
      }
    ],
    mercancias: [
      {
        bienesTranspId: '50433238',
        descripcion: 'Gomitas',
        cantidad: 1,
        claveUnidadId: 'XPK',
        pesoEnKg: 10.000,
        valorMercancia: 1200.00,
        monedaId: 'USD',
        fraccionArancelariaId: '2005800100',
        tipoMateriaId: '04'
      },
      {
        bienesTranspId: '50433238',
        descripcion: 'Pulparindo',
        cantidad: 1,
        claveUnidadId: 'XPK',
        pesoEnKg: 10.000,
        valorMercancia: 1000.00,
        monedaId: 'USD',
        fraccionArancelariaId: '2005800100',
        tipoMateriaId: '04'
      }
    ],
    autotransporte: {
      permSCTId: 'TPAF02',
      numPermisoSCT: '123456',
      configVehicularId: 'C2',
      pesoBrutoVehicular: 1,
      placaVM: '555TTT',
      anioModeloVM: 2023,
      aseguraRespCivil: 'ODISEA',
      polizaRespCivil: '3456YUHNB234RT'
    },
    tiposFigura: [
      {
        tipoFiguraId: '01',
        rfcFigura: 'KAHO641101B39',
        numLicencia: 'D0908240',
        nombreFigura: 'OSCAR KALA HAAK'
      }
    ]
  };

  const complement: Complement = {
    cartaPorte: cartaPorte,
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 7. FACTURA CE TRASLADO TRASLADO MERCANCIA PROPIA (Facturación por referencias)
// ============================================================================
async function facturaCETrasladoTrasladoMercanciaPropiaUpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate.receptor@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601',
    satCfdiUseId: 'S01'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCETrasladoTrasladoMercanciaPropiaPorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Traslado Traslado Mercancia Propia (Por Referencias) ===\n');

  await facturaCETrasladoTrasladoMercanciaPropiaUpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    {
      itemCode: '50211503',
      itemSku: '131494-1055',
      quantity: 1.0,
      unitOfMeasurementCode: 'H87',
      description: 'My description...',
      unitPrice: 0.00,
      discount: 0,
      taxObjectCode: '01',
      itemTaxes: []
    }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    domicilio: {
      calle: 'SW Street.',
      numeroExterior: '12345',
      localidad: 'Oregon',
      estado: 'OR',
      paisId: 'USA',
      codigoPostal: '12345'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: '131494-1055',
      fraccionArancelariaId: '0101210100',
      cantidadAduana: '1',
      unidadAduanaId: '07',
      valorUnitarioAduana: '22.64',
      valorDolares: '22.64'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    motivoTrasladoId: '02',
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FCA',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    destinatarios: [
      {
        numRegIdTrib: '123456789',
        nombre: 'EKU9003173C9',
        domicilios: [
          {
            calle: 'SW Street.',
            numeroExterior: '12345',
            localidad: 'Oregon',
            estado: 'OR',
            paisId: 'USA',
            codigoPostal: '12345'
          }
        ]
      }
    ],
    mercancias: mercancias
  };

  const complement: Complement = {
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'USD',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 8. FACTURA CE TRASLADO TRASLADO (Facturación por referencias)
// ============================================================================
async function facturaCETrasladoTrasladoUpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate.receptor@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601',
    satCfdiUseId: 'G01'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCETrasladoTrasladoPorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Traslado Traslado (Por Referencias) ===\n');

  await facturaCETrasladoTrasladoUpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    { id: productoCigarrosTraslado, quantity: 2 }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    domicilio: {
      calle: 'ST. A',
      estado: 'TX',
      paisId: 'USA',
      codigoPostal: '00000'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: productoCigarrosTraslado,
      fraccionArancelariaId: '2402200100',
      cantidadAduana: '117.64',
      unidadAduanaId: '01',
      valorUnitarioAduana: '3.40',
      valorDolares: '400.00'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FOB',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const complement: Complement = {
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'USD',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// 9. FACTURA CE UNIDADES DE MEDIDA NO EQUIVALENTES (Facturación por referencias)
// ============================================================================
async function facturaCEUnidadesDeMedidaNoEquivalentesUpdatePeople(client: IFiscalapiClient): Promise<void> {
  const issuer: Person = {
    id: issuerId,
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    email: 'escuela.kemper.urgate@example.com',
    zipCode: '42501',
    satTaxRegimeId: '601'
  };
  const recipient: Person = {
    id: recipientId,
    tin: 'XEXX010101000',
    legalName: 'U.S. 0026 SW',
    email: 'us.0026.sw@example.com',
    zipCode: '42501',
    satTaxRegimeId: '616',
    satCfdiUseId: 'CP01',
    countryId: 'USA',
    foreignTin: '123456789'
  };
  await client.persons.update(issuer);
  await client.persons.update(recipient);
}

async function facturaCEUnidadesDeMedidaNoEquivalentesPorReferencias(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Unidades De Medida No Equivalentes (Por Referencias) ===\n');

  await facturaCEUnidadesDeMedidaNoEquivalentesUpdatePeople(client);

  const issuer: InvoiceIssuer = { id: issuerId };

  const recipient: InvoiceRecipient = { id: recipientId };

  const items: InvoiceItem[] = [
    { id: productoBebida, quantity: 1.000 }
  ];

  const emisor: ComercioExteriorEmisor = {
    domicilio: {
      calle: 'CALLE DEL PAPEL',
      coloniaId: '0214',
      localidadId: '01',
      municipioId: '014',
      estadoId: 'QUE',
      paisId: 'MEX',
      codigoPostalId: '76199'
    }
  };

  const receptor: ComercioExteriorReceptor = {
    numRegIdTrib: '123456789',
    domicilio: {
      calle: 'ST. A',
      estado: 'TX',
      paisId: 'USA',
      codigoPostal: '00000'
    }
  };

  const mercancias: ComercioExteriorMercancia[] = [
    {
      noIdentificacion: productoBebida,
      fraccionArancelariaId: '2009310201',
      cantidadAduana: '0.500',
      unidadAduanaId: '08',
      valorUnitarioAduana: '200.00',
      valorDolares: '100.00'
    }
  ];

  const comercioExterior: ComercioExteriorComplement = {
    claveDePedimentoId: 'A1',
    certificadoOrigen: 0,
    incotermId: 'FOB',
    tipoCambioUSD: tipoCambioUsdDof,
    emisor: emisor,
    receptor: receptor,
    mercancias: mercancias
  };

  const complement: Complement = {
    comercioExterior: comercioExterior
  };

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '99',
    paymentMethodCode: 'PPD',
    currencyCode: 'USD',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'CCE',
    date: currentDate,
    paymentConditions: 'CondicionesDePago',
    exportCode: '02',
    issuer: issuer,
    recipient: recipient,
    items: items,
    complement: complement
  };

  const response: ApiResponse<Invoice> = await client.invoices.create(invoice);
  console.log('Response:', response);

  if (response.succeeded && response.data.id) {
    await verificarCfdiTimbrado(client, response.data.id);
  }
}

// ============================================================================
// FUNCION PRINCIPAL
// ============================================================================
async function main(): Promise<void> {
  console.log('=== Ejemplos de Factura con Comercio Exterior FiscalAPI (Por Referencias) ===\n');

  const client: IFiscalapiClient = FiscalapiClient.create(settings);

  try {
    // Comentar los casos de uso que no se desean ejecutar

    await facturaCEIngresoConCartaPorte31PorReferencias(client);
    await facturaCEIngresoDiferentesMonedasPorReferencias(client);
    await facturaCEKitPartePorReferencias(client);
    await facturaCEReceptorExtranjeroPorReferencias(client);
    await facturaCEReceptorNacionalPorReferencias(client);
    await facturaCETrasladoConCartaPorte31PorReferencias(client);
    await facturaCETrasladoTrasladoMercanciaPropiaPorReferencias(client);
    await facturaCETrasladoTrasladoPorReferencias(client);
    await facturaCEUnidadesDeMedidaNoEquivalentesPorReferencias(client);

    console.log('\nEjecución completada.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar función principal
main();
