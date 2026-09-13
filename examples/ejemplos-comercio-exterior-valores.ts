/**
 * Ejemplos de facturas con complemento Comercio Exterior (CFDI 4.0) usando el SDK de FiscalAPI
 * Todos los métodos usan el modo "ByValues" - los datos del emisor y receptor van inline en la petición
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
  TaxCredential
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

// Sellos SAT de prueba (ESCUELA KEMPER URGATE)
const escuelaKemperUrgateBase64Cer: string = "MIIFsDCCA5igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDM0MTYwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTE4MTE0MzUxWhcNMjcwNTE4MTE0MzUxWjCB1zEnMCUGA1UEAxMeRVNDVUVMQSBLRU1QRVIgVVJHQVRFIFNBIERFIENWMScwJQYDVQQpEx5FU0NVRUxBIEtFTVBFUiBVUkdBVEUgU0EgREUgQ1YxJzAlBgNVBAoTHkVTQ1VFTEEgS0VNUEVSIFVSR0FURSBTQSBERSBDVjElMCMGA1UELRMcRUtVOTAwMzE3M0M5IC8gVkFEQTgwMDkyN0RKMzEeMBwGA1UEBRMVIC8gVkFEQTgwMDkyN0hTUlNSTDA1MRMwEQYDVQQLEwpTdWN1cnNhbCAxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtmecO6n2GS0zL025gbHGQVxznPDICoXzR2uUngz4DqxVUC/w9cE6FxSiXm2ap8Gcjg7wmcZfm85EBaxCx/0J2u5CqnhzIoGCdhBPuhWQnIh5TLgj/X6uNquwZkKChbNe9aeFirU/JbyN7Egia9oKH9KZUsodiM/pWAH00PCtoKJ9OBcSHMq8Rqa3KKoBcfkg1ZrgueffwRLws9yOcRWLb02sDOPzGIm/jEFicVYt2Hw1qdRE5xmTZ7AGG0UHs+unkGjpCVeJ+BEBn0JPLWVvDKHZAQMj6s5Bku35+d/MyATkpOPsGT/VTnsouxekDfikJD1f7A1ZpJbqDpkJnss3vQIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAFaUgj5PqgvJigNMgtrdXZnbPfVBbukAbW4OGnUhNrA7SRAAfv2BSGk16PI0nBOr7qF2mItmBnjgEwk+DTv8Zr7w5qp7vleC6dIsZFNJoa6ZndrE/f7KO1CYruLXr5gwEkIyGfJ9NwyIagvHHMszzyHiSZIA850fWtbqtythpAliJ2jF35M5pNS+YTkRB+T6L/c6m00ymN3q9lT1rB03YywxrLreRSFZOSrbwWfg34EJbHfbFXpCSVYdJRfiVdvHnewN0r5fUlPtR9stQHyuqewzdkyb5jTTw02D2cUfL57vlPStBj7SEi3uOWvLrsiDnnCIxRMYJ2UA2ktDKHk+zWnsDmaeleSzonv2CHW42yXYPCvWi88oE1DJNYLNkIjua7MxAnkNZbScNw01A6zbLsZ3y8G6eEYnxSTRfwjd8EP4kdiHNJftm7Z4iRU7HOVh79/lRWB+gd171s3d/mI9kte3MRy6V8MMEMCAnMboGpaooYwgAmwclI2XZCczNWXfhaWe0ZS5PmytD/GDpXzkX0oEgY9K/uYo5V77NdZbGAjmyi8cE2B2ogvyaN2XfIInrZPgEffJ4AB7kFA2mwesdLOCh0BLD9itmCve3A1FGR4+stO2ANUoiI3w3Tv2yQSg4bjeDlJ08lXaaFCLW2peEXMXjQUk7fmpb5MNuOUTW6BE=";
const escuelaKemperUrgateBase64Key: string = "MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS/AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucoZQObOaLUEm+I+QZ7Y8Giupo+F1XWkLvAsdk/uZlJcTfKLJyJbJwsQYbSpLOCLataZ4O5MVnnmMbfG//NKJn9kSMvJQZhSwAwoGLYDm1ESGezrvZabgFJnoQv8Si1nAhVGTk9FkFBesxRzq07dmZYwFCnFSX4xt2fDHs1PMpQbeq83aL/PzLCce3kxbYSB5kQlzGtUYayiYXcu0cVRu228VwBLCD+2wTDDoCmRXtPesgrLKUR4WWWb5N2AqAU1mNDC+UEYsENAerOFXWnmwrcTAu5qyZ7GsBMTpipW4Dbou2yqQ0lpA/aB06n1kz1aL6mNqGPaJ+OqoFuc8Ugdhadd+MmjHfFzoI20SZ3b2geCsUMNCsAd6oXMsZdWm8lzjqCGWHFeol0ik/xHMQvuQkkeCsQ28PBxdnUgf7ZGer+TN+2ZLd2kvTBOk6pIVgy5yC6cZ+o1Tloql9hYGa6rT3xcMbXlW+9e5jM2MWXZliVW3ZhaPjptJFDbIfWxJPjz4QvKyJk0zok4muv13Iiwj2bCyefUTRz6psqI4cGaYm9JpscKO2RCJN8UluYGbbWmYQU+Int6LtZj/lv8p6xnVjWxYI+rBPdtkpfFYRp+MJiXjgPw5B6UGuoruv7+vHjOLHOotRo+RdjZt7NqL9dAJnl1Qb2jfW6+d7NYQSI/bAwxO0sk4taQIT6Gsu/8kfZOPC2xk9rphGqCSS/4q3Os0MMjA1bcJLyoWLp13pqhK6bmiiHw0BBXH4fbEp4xjSbpPx4tHXzbdn8oDsHKZkWh3pPC2J/nVl0k/yF1KDVowVtMDXE47k6TGVcBoqe8PDXCG9+vjRpzIidqNo5qebaUZu6riWMWzldz8x3Z/jLWXuDiM7/Yscn0Z2GIlfoeyz+GwP2eTdOw9EUedHjEQuJY32bq8LICimJ4Ht+zMJKUyhwVQyAER8byzQBwTYmYP5U0wdsyIFitphw+/IH8+v08Ia1iBLPQAeAvRfTTIFLCs8foyUrj5Zv2B/wTYIZy6ioUM+qADeXyo45uBLLqkN90Rf6kiTqDld78NxwsfyR5MxtJLVDFkmf2IMMJHTqSfhbi+7QJaC11OOUJTD0v9wo0X/oO5GvZhe0ZaGHnm9zqTopALuFEAxcaQlc4R81wjC4wrIrqWnbcl2dxiBtD73KW+wcC9ymsLf4I8BEmiN25lx/OUc1IHNyXZJYSFkEfaxCEZWKcnbiyf5sqFSSlEqZLc4lUPJFAoP6s1FHVcyO0odWqdadhRZLZC9RCzQgPlMRtji/OXy5phh7diOBZv5UYp5nb+MZ2NAB/eFXm2JLguxjvEstuvTDmZDUb6Uqv++RdhO5gvKf/AcwU38ifaHQ9uvRuDocYwVxZS2nr9rOwZ8nAh+P2o4e0tEXjxFKQGhxXYkn75H3hhfnFYjik/2qunHBBZfcdG148MaNP6DjX33M238T9Zw/GyGx00JMogr2pdP4JAErv9a5yt4YR41KGf8guSOUbOXVARw6+ybh7+meb7w4BeTlj3aZkv8tVGdfIt3lrwVnlbzhLjeQY6PplKp3/a5Kr5yM0T4wJoKQQ6v3vSNmrhpbuAtKxpMILe8CQoo=";
const password: string = "12345678a";

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
// 1. FACTURA CE INGRESO CON CARTA PORTE 31 (Facturación por valores)
// ============================================================================
async function facturaCEIngresoConCartaPorte31PorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Ingreso Con Carta Porte 31 (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'XEXX010101000',
    legalName: 'Persona Fisica Extranjera',
    zipCode: '42501',
    taxRegimeCode: '616',
    cfdiUseCode: 'S01',
    countryId: 'USA',
    foreignTin: '123456789'
  };

  const items: InvoiceItem[] = [
    {
      itemCode: '78101800',
      itemSku: 'SERV02',
      quantity: 1.0,
      unitOfMeasurementCode: 'HUR',
      description: 'FLETE',
      unitPrice: 2300.00,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' },
        { taxCode: '003', taxTypeCode: 'Tasa', taxRate: '0.300000', taxFlagCode: 'R' }
      ]
    },
    {
      itemCode: '50161509',
      itemSku: 'A0001',
      quantity: 1.0,
      unitOfMeasurementCode: 'H87',
      description: 'Gomitas',
      unitPrice: 120.00,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' }
      ]
    },
    {
      itemCode: '50307037',
      itemSku: 'A0002',
      quantity: 1.0,
      unitOfMeasurementCode: 'H87',
      description: 'Pulparindo',
      unitPrice: 100.00,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' }
      ]
    }
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
      noIdentificacion: 'A0001',
      fraccionArancelariaId: '4011101099',
      cantidadAduana: '1.000',
      unidadAduanaId: '06',
      valorUnitarioAduana: '120.00',
      valorDolares: '120.00'
    },
    {
      noIdentificacion: 'A0002',
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
// 2. FACTURA CE INGRESO DIFERENTES MONEDAS (Facturación por valores)
// ============================================================================
async function facturaCEIngresoDiferentesMonedasPorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Ingreso Diferentes Monedas (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'XEXX010101000',
    legalName: 'Persona Fisica Extranjera',
    zipCode: '42501',
    taxRegimeCode: '616',
    cfdiUseCode: 'S01',
    countryId: 'USA',
    foreignTin: '123456789'
  };

  const items: InvoiceItem[] = [
    {
      itemCode: '50211503',
      itemSku: '131494-1055',
      quantity: 2,
      unitOfMeasurementCode: 'H87',
      description: 'Cigarros',
      unitPrice: 200.00,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' },
        { taxCode: '001', taxTypeCode: 'Tasa', taxRate: '0.100000', taxFlagCode: 'R' },
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.106666', taxFlagCode: 'R' }
      ]
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
      noIdentificacion: '131494-1055',
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
// 3. FACTURA CE KIT PARTE (Facturación por valores)
// ============================================================================
async function facturaCEKitPartePorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Kit Parte (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'XEXX010101000',
    legalName: 'U.S. 0026 SW',
    zipCode: '42501',
    taxRegimeCode: '616',
    cfdiUseCode: 'CP01',
    countryId: 'USA',
    foreignTin: '123456789'
  };

  const items: InvoiceItem[] = [
    {
      itemCode: '51241200',
      itemSku: '131494-1055',
      quantity: 1.0,
      unitOfMeasurementCode: 'H87',
      description: 'FORMULA MAGISTRAL',
      unitPrice: 200.00,
      discount: 0,
      taxObjectCode: '01',
      itemTaxes: []
    },
    {
      itemCode: '51241200',
      itemSku: '131494-1055',
      quantity: 1.0,
      unitOfMeasurementCode: 'H87',
      description: 'FORMULA MAGISTRAL',
      unitPrice: 200.00,
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
      noIdentificacion: '131494-1055',
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
// 4. FACTURA CE RECEPTOR EXTRANJERO (Facturación por valores)
// ============================================================================
async function facturaCEReceptorExtranjeroPorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Receptor Extranjero (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'XEXX010101000',
    legalName: 'U.S. 0026 SW',
    zipCode: '42501',
    taxRegimeCode: '616',
    cfdiUseCode: 'CP01',
    countryId: 'USA',
    foreignTin: '123456789'
  };

  const items: InvoiceItem[] = [
    {
      itemCode: '50211503',
      itemSku: '131494-1055',
      quantity: 2,
      unitOfMeasurementCode: 'H87',
      description: 'Cigarros',
      unitPrice: 200.00,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' },
        { taxCode: '001', taxTypeCode: 'Tasa', taxRate: '0.100000', taxFlagCode: 'R' }
      ]
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
      noIdentificacion: '131494-1055',
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
// 5. FACTURA CE RECEPTOR NACIONAL (Facturación por valores)
// ============================================================================
async function facturaCEReceptorNacionalPorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Receptor Nacional (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'URE180429TM6',
    legalName: 'UNIVERSIDAD ROBOTICA ESPAÑOLA',
    zipCode: '86991',
    taxRegimeCode: '601',
    cfdiUseCode: 'G01'
  };

  const items: InvoiceItem[] = [
    {
      itemCode: '50211503',
      itemSku: '131494-1055',
      quantity: 2,
      unitOfMeasurementCode: 'H87',
      description: 'Cigarros',
      unitPrice: 200.00,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' },
        { taxCode: '001', taxTypeCode: 'Tasa', taxRate: '0.100000', taxFlagCode: 'R' },
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.106666', taxFlagCode: 'R' }
      ]
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
      noIdentificacion: '131494-1055',
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
// 6. FACTURA CE TRASLADO CON CARTA PORTE 31 (Facturación por valores)
// ============================================================================
async function facturaCETrasladoConCartaPorte31PorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Traslado Con Carta Porte 31 (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    zipCode: '42501',
    taxRegimeCode: '601',
    cfdiUseCode: 'S01'
  };

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
// 7. FACTURA CE TRASLADO TRASLADO MERCANCIA PROPIA (Facturación por valores)
// ============================================================================
async function facturaCETrasladoTrasladoMercanciaPropiaPorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Traslado Traslado Mercancia Propia (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    zipCode: '42501',
    taxRegimeCode: '601',
    cfdiUseCode: 'S01'
  };

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
// 8. FACTURA CE TRASLADO TRASLADO (Facturación por valores)
// ============================================================================
async function facturaCETrasladoTrasladoPorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Traslado Traslado (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    zipCode: '42501',
    taxRegimeCode: '601',
    cfdiUseCode: 'G01'
  };

  const items: InvoiceItem[] = [
    {
      itemCode: '50211503',
      itemSku: '131494-1055',
      quantity: 2,
      unitOfMeasurementCode: 'H87',
      description: 'Cigarros',
      unitPrice: 200.00,
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
      noIdentificacion: '131494-1055',
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
// 9. FACTURA CE UNIDADES DE MEDIDA NO EQUIVALENTES (Facturación por valores)
// ============================================================================
async function facturaCEUnidadesDeMedidaNoEquivalentesPorValores(client: IFiscalapiClient): Promise<void> {
  console.log('\n=== Factura CE Unidades De Medida No Equivalentes (Por Valores) ===\n');

  const issuer: InvoiceIssuer = {
    tin: 'EKU9003173C9',
    legalName: 'ESCUELA KEMPER URGATE',
    taxRegimeCode: '601',
    taxCredentials: [
      { base64File: escuelaKemperUrgateBase64Cer, fileType: 0, password },
      { base64File: escuelaKemperUrgateBase64Key, fileType: 1, password }
    ]
  };

  const recipient: InvoiceRecipient = {
    tin: 'XEXX010101000',
    legalName: 'U.S. 0026 SW',
    zipCode: '42501',
    taxRegimeCode: '616',
    cfdiUseCode: 'CP01',
    countryId: 'USA',
    foreignTin: '123456789'
  };

  const items: InvoiceItem[] = [
    {
      itemCode: '50201708',
      itemSku: '131494-1055',
      quantity: 1.000,
      unitOfMeasurementCode: 'H87',
      description: 'Bebida',
      unitPrice: 100.00,
      discount: 0,
      taxObjectCode: '02',
      itemTaxes: [
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' },
        { taxCode: '001', taxTypeCode: 'Tasa', taxRate: '0.100000', taxFlagCode: 'R' },
        { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.106666', taxFlagCode: 'R' }
      ]
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
      noIdentificacion: '131494-1055',
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
  console.log('=== Ejemplos de Factura con Comercio Exterior FiscalAPI (Por Valores) ===\n');

  const client: IFiscalapiClient = FiscalapiClient.create(settings);

  try {
    // Comentar los casos de uso que no se desean ejecutar

    await facturaCEIngresoConCartaPorte31PorValores(client);
    await facturaCEIngresoDiferentesMonedasPorValores(client);
    await facturaCEKitPartePorValores(client);
    await facturaCEReceptorExtranjeroPorValores(client);
    await facturaCEReceptorNacionalPorValores(client);
    await facturaCETrasladoConCartaPorte31PorValores(client);
    await facturaCETrasladoTrasladoMercanciaPropiaPorValores(client);
    await facturaCETrasladoTrasladoPorValores(client);
    await facturaCEUnidadesDeMedidaNoEquivalentesPorValores(client);

    console.log('\nEjecución completada.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar función principal
main();
