/**
 * Ejemplos de facturas con complemento Carta Porte (CFDI 4.0) usando el SDK de FiscalAPI
 * Todos los m�todos usan el modo "ByReference"
 */

import { FiscalapiClient, FiscalapiSettings, Invoice } from '../src/index';
import { inspect } from 'util';

// Configuración de la consola para mostrar objetos anidados
inspect.defaultOptions.depth = null;
inspect.defaultOptions.colors = true;

// Configuración de FiscalAPI
const settings: FiscalapiSettings = {
    apiUrl: 'https://test.fiscalapi.com',
    apiKey: '<API_KEY>',
    tenant: '<TENANT_ID>',
    debug: true
};

// Sellos SAT de prueba
const escuelaKemperUrgateBase64Cer = "MIIFsDCCA5igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDM0MTYwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTE4MTE0MzUxWhcNMjcwNTE4MTE0MzUxWjCB1zEnMCUGA1UEAxMeRVNDVUVMQSBLRU1QRVIgVVJHQVRFIFNBIERFIENWMScwJQYDVQQpEx5FU0NVRUxBIEtFTVBFUiBVUkdBVEUgU0EgREUgQ1YxJzAlBgNVBAoTHkVTQ1VFTEEgS0VNUEVSIFVSR0FURSBTQSBERSBDVjElMCMGA1UELRMcRUtVOTAwMzE3M0M5IC8gVkFEQTgwMDkyN0RKMzEeMBwGA1UEBRMVIC8gVkFEQTgwMDkyN0hTUlNSTDA1MRMwEQYDVQQLEwpTdWN1cnNhbCAxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtmecO6n2GS0zL025gbHGQVxznPDICoXzR2uUngz4DqxVUC/w9cE6FxSiXm2ap8Gcjg7wmcZfm85EBaxCx/0J2u5CqnhzIoGCdhBPuhWQnIh5TLgj/X6uNquwZkKChbNe9aeFirU/JbyN7Egia9oKH9KZUsodiM/pWAH00PCtoKJ9OBcSHMq8Rqa3KKoBcfkg1ZrgueffwRLws9yOcRWLb02sDOPzGIm/jEFicVYt2Hw1qdRE5xmTZ7AGG0UHs+unkGjpCVeJ+BEBn0JPLWVvDKHZAQMj6s5Bku35+d/MyATkpOPsGT/VTnsouxekDfikJD1f7A1ZpJbqDpkJnss3vQIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAFaUgj5PqgvJigNMgtrdXZnbPfVBbukAbW4OGnUhNrA7SRAAfv2BSGk16PI0nBOr7qF2mItmBnjgEwk+DTv8Zr7w5qp7vleC6dIsZFNJoa6ZndrE/f7KO1CYruLXr5gwEkIyGfJ9NwyIagvHHMszzyHiSZIA850fWtbqtythpAliJ2jF35M5pNS+YTkRB+T6L/c6m00ymN3q9lT1rB03YywxrLreRSFZOSrbwWfg34EJbHfbFXpCSVYdJRfiVdvHnewN0r5fUlPtR9stQHyuqewzdkyb5jTTw02D2cUfL57vlPStBj7SEi3uOWvLrsiDnnCIxRMYJ2UA2ktDKHk+zWnsDmaeleSzonv2CHW42yXYPCvWi88oE1DJNYLNkIjua7MxAnkNZbScNw01A6zbLsZ3y8G6eEYnxSTRfwjd8EP4kdiHNJftm7Z4iRU7HOVh79/lRWB+gd171s3d/mI9kte3MRy6V8MMEMCAnMboGpaooYwgAmwclI2XZCczNWXfhaWe0ZS5PmytD/GDpXzkX0oEgY9K/uYo5V77NdZbGAjmyi8cE2B2ogvyaN2XfIInrZPgEffJ4AB7kFA2mwesdLOCh0BLD9itmCve3A1FGR4+stO2ANUoiI3w3Tv2yQSg4bjeDlJ08lXaaFCLW2peEXMXjQUk7fmpb5MNuOUTW6BE=";
const escuelaKemperUrgateBase64Key = "MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS/AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucoZQObOaLUEm+I+QZ7Y8Giupo+F1XWkLvAsdk/uZlJcTfKLJyJbJwsQYbSpLOCLataZ4O5MVnnmMbfG//NKJn9kSMvJQZhSwAwoGLYDm1ESGezrvZabgFJnoQv8Si1nAhVGTk9FkFBesxRzq07dmZYwFCnFSX4xt2fDHs1PMpQbeq83aL/PzLCce3kxbYSB5kQlzGtUYayiYXcu0cVRu228VwBLCD+2wTDDoCmRXtPesgrLKUR4WWWb5N2AqAU1mNDC+UEYsENAerOFXWnmwrcTAu5qyZ7GsBMTpipW4Dbou2yqQ0lpA/aB06n1kz1aL6mNqGPaJ+OqoFuc8Ugdhadd+MmjHfFzoI20SZ3b2geCsUMNCsAd6oXMsZdWm8lzjqCGWHFeol0ik/xHMQvuQkkeCsQ28PBxdnUgf7ZGer+TN+2ZLd2kvTBOk6pIVgy5yC6cZ+o1Tloql9hYGa6rT3xcMbXlW+9e5jM2MWXZliVW3ZhaPjptJFDbIfWxJPjz4QvKyJk0zok4muv13Iiwj2bCyefUTRz6psqI4cGaYm9JpscKO2RCJN8UluYGbbWmYQU+Int6LtZj/lv8p6xnVjWxYI+rBPdtkpfFYRp+MJiXjgPw5B6UGuoruv7+vHjOLHOotRo+RdjZt7NqL9dAJnl1Qb2jfW6+d7NYQSI/bAwxO0sk4taQIT6Gsu/8kfZOPC2xk9rphGqCSS/4q3Os0MMjA1bcJLyoWLp13pqhK6bmiiHw0BBXH4fbEp4xjSbpPx4tHXzbdn8oDsHKZkWh3pPC2J/nVl0k/yF1KDVowVtMDXE47k6TGVcBoqe8PDXCG9+vjRpzIidqNo5qebaUZu6riWMWzldz8x3Z/jLWXuDiM7/Yscn0Z2GIlfoeyz+GwP2eTdOw9EUedHjEQuJY32bq8LICimJ4Ht+zMJKUyhwVQyAER8byzQBwTYmYP5U0wdsyIFitphw+/IH8+v08Ia1iBLPQAeAvRfTTIFLCs8foyUrj5Zv2B/wTYIZy6ioUM+qADeXyo45uBLLqkN90Rf6kiTqDld78NxwsfyR5MxtJLVDFkmf2IMMJHTqSfhbi+7QJaC11OOUJTD0v9wo0X/oO5GvZhe0ZaGHnm9zqTopALuFEAxcaQlc4R81wjC4wrIrqWnbcl2dxiBtD73KW+wcC9ymsLf4I8BEmiN25lx/OUc1IHNyXZJYSFkEfaxCEZWKcnbiyf5sqFSSlEqZLc4lUPJFAoP6s1FHVcyO0odWqdadhRZLZC9RCzQgPlMRtji/OXy5phh7diOBZv5UYp5nb+MZ2NAB/eFXm2JLguxjvEstuvTDmZDUb6Uqv++RdhO5gvKf/AcwU38ifaHQ9uvRuDocYwVxZS2nr9rOwZ8nAh+P2o4e0tEXjxFKQGhxXYkn75H3hhfnFYjik/2qunHBBZfcdG148MaNP6DjX33M238T9Zw/GyGx00JMogr2pdP4JAErv9a5yt4YR41KGf8guSOUbOXVARw6+ybh7+meb7w4BeTlj3aZkv8tVGdfIt3lrwVnlbzhLjeQY6PplKp3/a5Kr5yM0T4wJoKQQ6v3vSNmrhpbuAtKxpMILe8CQoo=";
const password = "12345678a";
const currentDate = '2026-03-20T10:04:06';

// ============================================================================
// 1. FACTURA INGRESO - AUTOTRANSPORTE NACIONAL (ByReference)
// ============================================================================
async function facturaIngresoAutotransporteNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [
      {
        itemCode: '78101800',
        itemSku: 'UT421511',
        quantity: 1,
        unitOfMeasurementCode: 'H87',
        description: 'Transporte de carga por carretera',
        unitPrice: 100.00,
        discount: 0,
        taxObjectCode: '01',
        itemTaxes: []
      }
    ],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 1,
        pesoNetoTotal: 1,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'S�',
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'URE180429TM6',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'URE180429TM6',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            distanciaRecorrida: 1,
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2003-04-02T00:00:00',
            loteMedicamento: 'LoteMedic1',
            formaFarmaceuticaId: '01',
            condicionesEspTranspId: '01',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            fraccionArancelariaId: '6309000100',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        autotransporte: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'NumPermisoSCT1',
          configVehicularId: 'VL',
          pesoBrutoVehicular: 1,
          placaVM: 'plac892',
          anioModeloVM: 2020,
          aseguraRespCivil: 'AseguraRespCivil',
          polizaRespCivil: '123456789',
          remolques: [
            { subTipoRemId: 'CTR004', placa: 'VL45K98' }
          ]
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'URE180429TM6',
            numLicencia: 'NumLicencia1',
            nombreFigura: 'NombreFigura1',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: 'NumeroExterior1',
              numeroInterior: 'NumeroInterior1',
              coloniaId: 'Colonia1',
              localidadId: 'Localidad1',
              referencia: 'Referencia1',
              municipioId: 'Municipio1',
              estadoId: 'Estado1',
              paisId: 'AFG',
              codigoPostalId: 'CodigoPosta1'
            }
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 2. FACTURA INGRESO - AUTOTRANSPORTE NACIONAL CON IMPUESTOS (ByReference)
// ============================================================================
async function facturaIngresoAutotransporteNacionalConImpuestos(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Nacional con Impuestos (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [
      {
        itemCode: '78101800',
        itemSku: 'UT421511',
        quantity: 1,
        unitOfMeasurementCode: 'H87',
        description: 'Transporte de carga por carretera',
        unitPrice: 26232.75,
        discount: 0,
        taxObjectCode: '02',
        itemTaxes: [
          { taxCode: '002', taxTypeCode: 'Tasa', taxRate: 0.160000, taxFlagCode: 'T' },
          { taxCode: '002', taxTypeCode: 'Tasa', taxRate: 0.040000, taxFlagCode: 'R' }
        ]
      }
    ],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 1,
        pesoNetoTotal: 1,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'S�',
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'URE180429TM6',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'URE180429TM6',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            distanciaRecorrida: 1,
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2003-04-02T00:00:00',
            loteMedicamento: 'LoteMedic1',
            formaFarmaceuticaId: '01',
            condicionesEspTranspId: '01',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            fraccionArancelariaId: '6309000100',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        autotransporte: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'NumPermisoSCT1',
          configVehicularId: 'VL',
          pesoBrutoVehicular: 1,
          placaVM: 'plac892',
          anioModeloVM: 2020,
          aseguraRespCivil: 'AseguraRespCivil',
          polizaRespCivil: '123456789',
          remolques: [
            { subTipoRemId: 'CTR004', placa: 'VL45K98' }
          ]
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'URE180429TM6',
            numLicencia: 'NumLicencia1',
            nombreFigura: 'NombreFigura1',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: 'NumeroExterior1',
              numeroInterior: 'NumeroInterior1',
              coloniaId: 'Colonia1',
              localidadId: 'Localidad1',
              referencia: 'Referencia1',
              municipioId: 'Municipio1',
              estadoId: 'Estado1',
              paisId: 'AFG',
              codigoPostalId: 'CodigoPosta1'
            }
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 3. FACTURA INGRESO - AUTOTRANSPORTE EXTRANJERO / EXPORTACI�N (ByReference)
// ============================================================================
async function facturaIngresoAutotransporteExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Extranjero - Exportaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [
      {
        itemCode: '78101800',
        itemSku: 'UT421511',
        quantity: 1,
        unitOfMeasurementCode: 'H87',
        description: 'Transporte de carga por carretera',
        unitPrice: 100.00,
        discount: 0,
        taxObjectCode: '01',
        itemTaxes: []
      }
    ],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 1,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'S�',
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            distanciaRecorrida: 1,
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2003-04-02T00:00:00',
            loteMedicamento: 'LoteMedic1',
            formaFarmaceuticaId: '01',
            condicionesEspTranspId: '01',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            fraccionArancelariaId: '6309000100',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        autotransporte: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'NumPermisoSCT1',
          configVehicularId: 'VL',
          pesoBrutoVehicular: 1,
          placaVM: 'plac892',
          anioModeloVM: 2020,
          aseguraRespCivil: 'AseguraRespCivil',
          polizaRespCivil: '123456789',
          remolques: [
            { subTipoRemId: 'CTR004', placa: 'VL45K98' }
          ]
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'EKU9003173C9',
            numLicencia: 'NumLicencia1',
            nombreFigura: 'NombreFigura1',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 4. FACTURA INGRESO - AUTOTRANSPORTE INTERNACIONAL ADUANERO / IMPORTACI�N (ByReference)
// ============================================================================
async function facturaIngresoAutotransporteInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Internacional Aduanero - Importaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [
      {
        itemCode: '78101800',
        itemSku: 'UT421511',
        quantity: 1,
        unitOfMeasurementCode: 'H87',
        description: 'Transporte de carga por carretera',
        unitPrice: 100.00,
        discount: 0,
        taxObjectCode: '01',
        itemTaxes: []
      }
    ],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 1,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'S�',
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            distanciaRecorrida: 1,
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2003-04-02T00:00:00',
            loteMedicamento: 'LoteMedic1',
            formaFarmaceuticaId: '01',
            condicionesEspTranspId: '01',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            fraccionArancelariaId: '6309000100',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              {
                tipoDocumentoId: '01',
                numPedimento: '23  43  0472  8000448',
                rfcImpo: 'EKU9003173C9'
              }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        autotransporte: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'NumPermisoSCT1',
          configVehicularId: 'VL',
          pesoBrutoVehicular: 1,
          placaVM: 'plac892',
          anioModeloVM: 2020,
          aseguraRespCivil: 'AseguraRespCivil',
          polizaRespCivil: '123456789',
          remolques: [
            { subTipoRemId: 'CTR004', placa: 'VL45K98' }
          ]
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'EKU9003173C9',
            numLicencia: 'NumLicencia1',
            nombreFigura: 'NombreFigura1',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 5. FACTURA INGRESO - TRANSPORTE FERROVIARIO NACIONAL (ByReference)
// ============================================================================
async function facturaIngresoTransporteFerroviarioNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Ferroviario Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        ubicaciones: [
          ...makeRailLocationsBase(),
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202025',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'JM047',
            nombreEstacion: 'HUEHUETOCA',
            fechaHoraSalidaLlegada: '2023-08-01T05:00:01',
            tipoEstacionId: '03',
            distanciaRecorrida: 100.00,
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202025' }
            ]
          }
        ],
        transporteFerroviario: makeRailwayTransport(),
        tiposFigura: [makeRailwayFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 6. FACTURA INGRESO - TRANSPORTE FERROVIARIO EXTRANJERO (ByReference)
// ============================================================================
async function facturaIngresoTransporteFerroviarioExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Ferroviario Extranjero - Exportaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          ...makeRailLocationsBase(),
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202025',
            rfcRemitenteDestinatario: 'XEXX010101000',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            numEstacionId: 'EF0001',
            nombreEstacion: 'NombreEstacion',
            fechaHoraSalidaLlegada: '2023-08-01T05:00:01',
            distanciaRecorrida: 100.00,
            domicilio: {
              calle: 'ST',
              numeroExterior: '1234',
              coloniaId: '1234',
              referencia: 'WHITE HOUSE',
              municipioId: '1234',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: '12345'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202025' }
            ]
          }
        ],
        transporteFerroviario: makeRailwayTransport(),
        tiposFigura: [makeRailwayFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 7. FACTURA INGRESO - TRANSPORTE FERROVIARIO INTERNACIONAL ADUANERO (ByReference)
// ============================================================================
async function facturaIngresoTransporteFerroviarioInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Ferroviario Internacional Aduanero - Importaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          ...makeRailLocationsBase(),
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202025',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'JM047',
            nombreEstacion: 'HUEHUETOCA',
            fechaHoraSalidaLlegada: '2023-08-01T05:00:01',
            tipoEstacionId: '03',
            distanciaRecorrida: 100.00,
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              {
                tipoDocumentoId: '01',
                numPedimento: '23  43  0472  8000448',
                rfcImpo: 'EKU9003173C9'
              }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202025' }
            ]
          }
        ],
        transporteFerroviario: makeRailwayTransport(),
        tiposFigura: [makeRailwayFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 8. FACTURA INGRESO - TRANSPORTE A�REO NACIONAL (ByReference)
// ============================================================================
async function facturaIngresoTransporteAereoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte A�reo Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 0,
        pesoNetoTotal: 10,
        unidadPesoId: 'XBX',
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'EA0417',
            nombreEstacion: 'Loreto',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'EA0418',
            nombreEstacion: 'Los Cabos',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            tipoEstacionId: '03',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        transporteAereo: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'Demo',
          matriculaAeronave: '61E5-WZ',
          nombreAseg: 'NombreAseg',
          numPolizaSeguro: 'NumPolizaSeguro',
          numeroGuia: 'acUbYlBVTmlzx',
          lugarContrato: 'LugarContrato',
          codigoTransportistaId: 'CA001',
          rfcEmbarcador: 'EKU9003173C9',
          nombreEmbarcador: 'Embarcador'
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'EKU9003173C9',
            numLicencia: 'a234567890',
            nombreFigura: 'NombreFigura'
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 9. FACTURA INGRESO - TRANSPORTE A�REO EXTRANJERO (ByReference)
// ============================================================================
async function facturaIngresoTransporteAereoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte A�reo Extranjero (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '03',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 10,
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'EA0417',
            nombreEstacion: 'Loreto',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            numEstacionId: 'EA0143',
            nombreEstacion: 'Phoenix-Mesa Gateway',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '12344',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: '12345'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        transporteAereo: makeAirTransport(),
        tiposFigura: [makeAirFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 10. FACTURA INGRESO - TRANSPORTE A�REO INTERNACIONAL ADUANERO (ByReference)
// ============================================================================
async function facturaIngresoTransporteAereoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte A�reo Internacional Aduanero (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '03',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 10,
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'EA0417',
            nombreEstacion: 'Loreto',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'EA0418',
            nombreEstacion: 'Los Cabos',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            tipoEstacionId: '03',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              { tipoDocumentoId: '01', numPedimento: '23  43  0472  8000448', rfcImpo: 'EKU9003173C9' }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        transporteAereo: makeAirTransport(),
        tiposFigura: [makeAirFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 11. FACTURA INGRESO - TRANSPORTE MAR�TIMO NACIONAL (ByReference)
// ============================================================================
async function facturaIngresoTransporteMAritimoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Mar�timo Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 1,
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            tipoEstacionId: '03',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ],
            detalleMercancia: {
              unidadPesoMercId: 'Tu',
              pesoBruto: 1,
              pesoNeto: 1,
              pesoTara: 0.001,
              numPiezas: 1
            }
          }
        ],
        transporteMaritimo: makeMaritimeTransport(),
        tiposFigura: [makeMaritimeFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 12. FACTURA INGRESO - TRANSPORTE MAR�TIMO EXTRANJERO (ByReference)
// ============================================================================
async function facturaIngresoTransporteMAritimoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Mar�timo Extranjero (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '02',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 1,
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            numEstacionId: 'PM120',
            nombreEstacion: 'NombreEstacion',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '12345',
              coloniaId: 'N/A',
              referencia: 'N/A',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: '12345'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ],
            detalleMercancia: {
              unidadPesoMercId: 'Tu',
              pesoBruto: 1,
              pesoNeto: 1,
              pesoTara: 0.001,
              numPiezas: 1
            }
          }
        ],
        transporteMaritimo: makeMaritimeTransport(),
        tiposFigura: [makeMaritimeFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 13. FACTURA INGRESO - TRANSPORTE MAR�TIMO INTERNACIONAL ADUANERO (ByReference)
// ============================================================================
async function facturaIngresoTransporteMAritimoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Mar�timo Internacional Aduanero (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    paymentFormCode: '01',
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    series: 'CP3.1',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '01',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 1,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' },
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'EA0417',
            nombreEstacion: 'Loreto',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T04:00:01',
            tipoEstacionId: '02',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2003-04-02T00:00:00',
            loteMedicamento: 'LoteMedic1',
            formaFarmaceuticaId: '01',
            condicionesEspTranspId: '01',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1.50,
            valorMercancia: 100,
            monedaId: 'MXN',
            fraccionArancelariaId: '6309000100',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              { tipoDocumentoId: '01', numPedimento: '23  43  0472  8000448', rfcImpo: 'EKU9003173C9' }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020', cvesTransporteId: '02' }
            ],
            detalleMercancia: {
              unidadPesoMercId: 'X1A',
              pesoBruto: 1.50,
              pesoNeto: 1.00,
              pesoTara: 0.50
            }
          }
        ],
        transporteMaritimo: makeMaritimeTransport(),
        transporteAereo: makeAirTransport(),
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'EKU9003173C9',
            numLicencia: 'NumLicencia1',
            nombreFigura: 'NombreFigura1',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: 'NumeroExterior1',
              numeroInterior: 'NumeroInterior1',
              coloniaId: 'Colonia1',
              localidadId: 'Localidad1',
              referencia: 'Referencia1',
              municipioId: 'Municipio1',
              estadoId: 'Estado1',
              paisId: 'AFG',
              codigoPostalId: 'CodigoPosta1'
            }
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 14. FACTURA TRASLADO - AUTOTRANSPORTE NACIONAL (ByReference)
// ============================================================================
async function facturaTrasladoAutotransporteNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Autotransporte Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 1,
        pesoNetoTotal: 0,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'S�',
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            distanciaRecorrida: 1,
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        autotransporte: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'NumPermisoSCT1',
          configVehicularId: 'VL',
          pesoBrutoVehicular: 1,
          placaVM: 'plac892',
          anioModeloVM: 2020,
          aseguraRespCivil: 'AseguraRespCivil',
          polizaRespCivil: '123456789',
          remolques: [
            { subTipoRemId: 'CTR004', placa: 'VL45K98' }
          ]
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'EKU9003173C9',
            numLicencia: 'a234567890',
            nombreFigura: 'NombreFigura'
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 15. FACTURA TRASLADO - AUTOTRANSPORTE EXTRANJERO (ByReference)
// ============================================================================
async function facturaTrasladoAutotransporteExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Autotransporte Extranjero - Exportaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 0,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'S�',
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            distanciaRecorrida: 1,
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2003-04-02T00:00:00',
            loteMedicamento: 'LoteMedic1',
            formaFarmaceuticaId: '01',
            condicionesEspTranspId: '01',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            fraccionArancelariaId: '6309000100',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        autotransporte: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'NumPermisoSCT1',
          configVehicularId: 'VL',
          pesoBrutoVehicular: 1,
          placaVM: 'plac892',
          anioModeloVM: 2020,
          aseguraRespCivil: 'AseguraRespCivil',
          polizaRespCivil: '123456789',
          remolques: [
            { subTipoRemId: 'CTR004', placa: 'VL45K98' }
          ]
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'EKU9003173C9',
            numLicencia: 'NumLicencia1',
            nombreFigura: 'NombreFigura1',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 16. FACTURA TRASLADO - AUTOTRANSPORTE INTERNACIONAL ADUANERO (ByReference)
// ============================================================================
async function facturaTrasladoAutotransporteInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Autotransporte Internacional Aduanero - Importaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 0,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'S�',
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            distanciaRecorrida: 1,
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2003-04-02T00:00:00',
            loteMedicamento: 'LoteMedic1',
            formaFarmaceuticaId: '01',
            condicionesEspTranspId: '01',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            fraccionArancelariaId: '6309000100',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              { tipoDocumentoId: '01', numPedimento: '23  43  0472  8000448', rfcImpo: 'EKU9003173C9' }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        autotransporte: {
          permSCTId: 'TPAF01',
          numPermisoSCT: 'NumPermisoSCT1',
          configVehicularId: 'VL',
          pesoBrutoVehicular: 1,
          placaVM: 'plac892',
          anioModeloVM: 2020,
          aseguraRespCivil: 'AseguraRespCivil',
          polizaRespCivil: '123456789',
          remolques: [
            { subTipoRemId: 'CTR004', placa: 'VL45K98' }
          ]
        },
        tiposFigura: [
          {
            tipoFiguraId: '01',
            rfcFigura: 'EKU9003173C9',
            numLicencia: 'NumLicencia1',
            nombreFigura: 'NombreFigura1',
            domicilio: {
              calle: 'ST',
              numeroExterior: '214',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: 'N/A'
            }
          }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 17. FACTURA TRASLADO - TRANSPORTE FERROVIARIO NACIONAL (ByReference)
// ============================================================================
async function facturaTrasladoTransporteFerroviarioNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Ferroviario Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        ubicaciones: [
          ...makeRailLocationsBase(),
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202025',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'JM047',
            nombreEstacion: 'HUEHUETOCA',
            fechaHoraSalidaLlegada: '2023-08-01T05:00:01',
            tipoEstacionId: '03',
            distanciaRecorrida: 100.00,
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202025' }
            ]
          }
        ],
        transporteFerroviario: makeRailwayTransport(),
        tiposFigura: [makeRailwayFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 18. FACTURA TRASLADO - TRANSPORTE FERROVIARIO EXTRANJERO (ByReference)
// ============================================================================
async function facturaTrasladoTransporteFerroviarioExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Ferroviario Extranjero - Exportaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          ...makeRailLocationsBase(),
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202025',
            rfcRemitenteDestinatario: 'XEXX010101000',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            numEstacionId: 'EF0001',
            nombreEstacion: 'NombreEstacion',
            fechaHoraSalidaLlegada: '2023-08-01T05:00:01',
            distanciaRecorrida: 100.00,
            domicilio: {
              calle: 'ST',
              numeroExterior: '1234',
              coloniaId: '1234',
              referencia: 'WHITE HOUSE',
              municipioId: '1234',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: '12345'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202025' }
            ]
          }
        ],
        transporteFerroviario: makeRailwayTransport(),
        tiposFigura: [makeRailwayFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 19. FACTURA TRASLADO - TRANSPORTE FERROVIARIO INTERNACIONAL ADUANERO (ByReference)
// ============================================================================
async function facturaTrasladoTransporteFerroviarioInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Ferroviario Internacional Aduanero - Importaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'S�',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          ...makeRailLocationsBase(),
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202025',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'JM047',
            nombreEstacion: 'HUEHUETOCA',
            fechaHoraSalidaLlegada: '2023-08-01T05:00:01',
            tipoEstacionId: '03',
            distanciaRecorrida: 100.00,
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              { tipoDocumentoId: '01', numPedimento: '23  43  0472  8000448', rfcImpo: 'EKU9003173C9' }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202025' }
            ]
          }
        ],
        transporteFerroviario: makeRailwayTransport(),
        tiposFigura: [makeRailwayFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 20. FACTURA TRASLADO - TRANSPORTE A�REO NACIONAL (ByReference)
// ============================================================================
async function facturaTrasladoTransporteAereoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte A�reo Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 10,
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'EA0417',
            nombreEstacion: 'Loreto',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'EA0418',
            nombreEstacion: 'Los Cabos',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            tipoEstacionId: '03',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        transporteAereo: makeAirTransport(),
        tiposFigura: [makeAirFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 21. FACTURA TRASLADO - TRANSPORTE A�REO EXTRANJERO (ByReference)
// ============================================================================
async function facturaTrasladoTransporteAereoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte A�reo Extranjero (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '03',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 10,
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'EA0417',
            nombreEstacion: 'Loreto',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            numEstacionId: 'EA0143',
            nombreEstacion: 'Phoenix-Mesa Gateway',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '12344',
              coloniaId: 'N/A',
              referencia: 'WHITE HOUSE',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: '12345'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        transporteAereo: makeAirTransport(),
        tiposFigura: [makeAirFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 22. FACTURA TRASLADO - TRANSPORTE A�REO INTERNACIONAL ADUANERO (ByReference)
// ============================================================================
async function facturaTrasladoTransporteAereoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte A�reo Internacional Aduanero - Importaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '03',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 10,
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'EA0417',
            nombreEstacion: 'Loreto',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'EA0418',
            nombreEstacion: 'Los Cabos',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            tipoEstacionId: '03',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              { tipoDocumentoId: '01', numPedimento: '23  43  0472  8000448', rfcImpo: 'EKU9003173C9' }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ]
          }
        ],
        transporteAereo: makeAirTransport(),
        tiposFigura: [makeAirFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 23. FACTURA TRASLADO - TRANSPORTE MAR�TIMO NACIONAL (ByReference)
// ============================================================================
async function facturaTrasladoTransporteMAritimoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Mar�timo Nacional (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 1,
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            tipoEstacionId: '03',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ],
            detalleMercancia: {
              unidadPesoMercId: 'Tu',
              pesoBruto: 1,
              pesoNeto: 1,
              pesoTara: 0.001,
              numPiezas: 1
            }
          }
        ],
        transporteMaritimo: makeMaritimeTransport(),
        tiposFigura: [makeMaritimeFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 24. FACTURA TRASLADO - TRANSPORTE MAR�TIMO EXTRANJERO (ByReference)
// ============================================================================
async function facturaTrasladoTransporteMAritimoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Mar�timo Extranjero (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '02',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 1,
        regimenAduaneros: [
          { regimenAduaneroId: 'EXD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'XEXX010101000',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numRegIdTrib: '01010101',
            residenciaFiscalId: 'USA',
            numEstacionId: 'PM120',
            nombreEstacion: 'NombreEstacion',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            domicilio: {
              calle: 'ST',
              numeroExterior: '12345',
              coloniaId: 'N/A',
              referencia: 'N/A',
              municipioId: 'N/A',
              estadoId: 'TX',
              paisId: 'USA',
              codigoPostalId: '12345'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ],
            detalleMercancia: {
              unidadPesoMercId: 'Tu',
              pesoBruto: 1,
              pesoNeto: 1,
              pesoTara: 0.001,
              numPiezas: 1
            }
          }
        ],
        transporteMaritimo: makeMaritimeTransport(),
        tiposFigura: [makeMaritimeFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 25. FACTURA TRASLADO - TRANSPORTE MAR�TIMO INTERNACIONAL ADUANERO (ByReference)
// ============================================================================
async function facturaTrasladoTransporteMAritimoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Mar�timo Internacional Aduanero - Importaci�n (ByReference) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
        id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
    },
    recipient: {
        id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
    },
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'S�',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '02',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 1,
        regimenAduaneros: [
          { regimenAduaneroId: 'IMD' },
          { regimenAduaneroId: 'IMD' }
        ],
        ubicaciones: [
          {
            tipoUbicacion: 'Origen',
            idUbicacion: 'OR101010',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
            tipoEstacionId: '01',
            domicilio: {
              calle: 'Calle1',
              numeroExterior: '211',
              numeroInterior: '212',
              coloniaId: '1957',
              localidadId: '13',
              referencia: 'casa blanca',
              municipioId: '011',
              estadoId: 'CMX',
              paisId: 'MEX',
              codigoPostalId: '13250'
            }
          },
          {
            tipoUbicacion: 'Destino',
            idUbicacion: 'DE202020',
            rfcRemitenteDestinatario: 'EKU9003173C9',
            nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
            numEstacionId: 'PM001',
            nombreEstacion: 'Rosarito',
            navegacionTraficoId: 'Altura',
            fechaHoraSalidaLlegada: '2023-08-01T00:00:01',
            tipoEstacionId: '03',
            domicilio: {
              calle: 'Calle2',
              numeroExterior: '214',
              numeroInterior: '215',
              coloniaId: '0347',
              localidadId: '23',
              referencia: 'casa negra',
              municipioId: '004',
              estadoId: 'COA',
              paisId: 'MEX',
              codigoPostalId: '25350'
            }
          }
        ],
        mercancias: [
          {
            bienesTranspId: '11121900',
            descripcion: 'Accesorios de equipo de telefon�a',
            cantidad: 1.0,
            claveUnidadId: 'XBX',
            materialPeligrosoId: 'No',
            denominacionGenericaProd: 'DenominacionGenericaProd1',
            denominacionDistintivaProd: 'DenominacionDistintivaProd1',
            fabricante: 'Fabricante1',
            fechaCaducidad: '2028-01-01T00:00:00',
            loteMedicamento: 'LoteMedic1',
            registroSanitarioFolioAutorizacion: 'RegistroSanita1',
            pesoEnKg: 1,
            valorMercancia: 100,
            monedaId: 'MXN',
            tipoMateriaId: '05',
            descripcionMateria: 'otramateria',
            documentacionAduanera: [
              { tipoDocumentoId: '01', numPedimento: '23  43  0472  8000448', rfcImpo: 'EKU9003173C9' }
            ],
            cantidadTransporta: [
              { cantidad: 1, idOrigen: 'OR101010', idDestino: 'DE202020' }
            ],
            detalleMercancia: {
              unidadPesoMercId: 'Tu',
              pesoBruto: 1,
              pesoNeto: 1,
              pesoTara: 0.001,
              numPiezas: 1
            }
          }
        ],
        transporteMaritimo: makeMaritimeTransport(),
        tiposFigura: [makeMaritimeFigure()]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// HELPERS COMPARTIDOS (Ferroviario / A�reo)
// ============================================================================

function makeStandardItem() {
  return {
    itemCode: '78101800',
    itemSku: 'UT421511',
    quantity: 1,
    unitOfMeasurementCode: 'H87',
    description: 'Transporte de carga por carretera',
    unitPrice: 100.00,
    discount: 0,
    taxObjectCode: '01',
    itemTaxes: []
  };
}

function makeRailwayTransport() {
  return {
    tipoDeServicioId: 'TS01',
    tipoDeTraficoId: 'TT01',
    derechosDePaso: [
      { tipoDerechoDePasoId: 'CDP114', kilometrajePagado: 100 }
    ],
    carros: [
      { tipoCarroId: 'TC08', matriculaCarro: 'A00012', guiaCarro: '123ASD', toneladasNetasCarro: 10 }
    ]
  };
}

function makeRailwayFigure() {
  return {
    tipoFiguraId: '02',
    rfcFigura: 'EKU9003173C9',
    nombreFigura: 'NombreFigura',
    partesTransporte: [
      { parteTransporteId: 'PT02' }
    ],
    domicilio: {
      calle: 'calle',
      numeroExterior: '211',
      coloniaId: '0814',
      localidadId: '01',
      referencia: 'casa blanca',
      municipioId: '010',
      estadoId: 'ZAC',
      paisId: 'MEX',
      codigoPostalId: '99080'
    }
  };
}

/** Returns the first 5 shared rail locations (Origen + 4 intermediate Destinos) */
function makeRailLocationsBase() {
  return [
    {
      tipoUbicacion: 'Origen',
      idUbicacion: 'OR101010',
      rfcRemitenteDestinatario: 'EKU9003173C9',
      nombreRemitenteDestinatario: 'NombreRemitenteDestinatario1',
      numEstacionId: 'Q0736',
      nombreEstacion: 'SANTO NINO',
      fechaHoraSalidaLlegada: '2023-08-01T00:00:00',
      tipoEstacionId: '01',
      domicilio: {
        calle: 'Calle1',
        numeroExterior: '211',
        numeroInterior: '212',
        coloniaId: '1957',
        localidadId: '13',
        referencia: 'casa blanca',
        municipioId: '011',
        estadoId: 'CMX',
        paisId: 'MEX',
        codigoPostalId: '13250'
      }
    },
    {
      tipoUbicacion: 'Destino',
      idUbicacion: 'DE202021',
      rfcRemitenteDestinatario: 'EKU9003173C9',
      nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
      numEstacionId: 'SC283',
      nombreEstacion: 'HUAXTITLA',
      fechaHoraSalidaLlegada: '2023-08-01T01:00:01',
      tipoEstacionId: '02',
      distanciaRecorrida: 100.00
    },
    {
      tipoUbicacion: 'Destino',
      idUbicacion: 'DE202022',
      rfcRemitenteDestinatario: 'EKU9003173C9',
      nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
      numEstacionId: 'TG0',
      nombreEstacion: 'NAVOJOA',
      fechaHoraSalidaLlegada: '2023-08-01T02:00:01',
      tipoEstacionId: '02',
      distanciaRecorrida: 100.00
    },
    {
      tipoUbicacion: 'Destino',
      idUbicacion: 'DE202023',
      rfcRemitenteDestinatario: 'EKU9003173C9',
      nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
      numEstacionId: 'E0029',
      nombreEstacion: 'TRES JAGUEYES',
      fechaHoraSalidaLlegada: '2023-08-01T03:00:01',
      tipoEstacionId: '02',
      distanciaRecorrida: 100.00
    },
    {
      tipoUbicacion: 'Destino',
      idUbicacion: 'DE202024',
      rfcRemitenteDestinatario: 'EKU9003173C9',
      nombreRemitenteDestinatario: 'NombreRemitenteDestinatario2',
      numEstacionId: 'TI032',
      nombreEstacion: 'NAVOLATO',
      fechaHoraSalidaLlegada: '2023-08-01T04:00:01',
      tipoEstacionId: '02',
      distanciaRecorrida: 100.00
    }
  ];
}

function makeAirTransport() {
  return {
    permSCTId: 'TPAF01',
    numPermisoSCT: 'Demo',
    matriculaAeronave: '61E5-WZ',
    nombreAseg: 'NombreAseg',
    numPolizaSeguro: 'NumPolizaSeguro',
    numeroGuia: 'acUbYlBVTmlzx',
    lugarContrato: 'LugarContrato',
    codigoTransportistaId: 'CA001',
    rfcEmbarcador: 'EKU9003173C9',
    nombreEmbarcador: 'Embarcador'
  };
}

function makeAirFigure() {
  return {
    tipoFiguraId: '01',
    rfcFigura: 'EKU9003173C9',
    numLicencia: 'a234567890',
    nombreFigura: 'NombreFigura'
  };
}

function makeMaritimeTransport() {
  return {
    permSCTId: 'TPAF01',
    numPermisoSCT: 'NumPermisoSCT1',
    nombreAseg: 'NombreAseg1',
    numPolizaSeguro: 'NumPolizaSeguro1',
    tipoEmbarcacionId: 'B01',
    matricula: 'Matricula1',
    numeroOMI: 'IMO1234567',
    anioEmbarcacion: 2003,
    nombreEmbarc: 'NombreEmbarc1',
    nacionalidadEmbarcId: 'AFG',
    unidadesDeArqBruto: 0.001,
    tipoCargaId: 'CGS',
    eslora: 0.01,
    manga: 0.01,
    calado: 0.01,
    puntal: 0.01,
    lineaNaviera: 'LineaNaviera1',
    nombreAgenteNaviero: 'NombreAgenteNaviero1',
    numAutorizacionNavieroId: 'ANC001/2022',
    numViaje: 'NumViaje1',
    numConocEmbarc: 'NumConocEmbarc1',
    permisoTempNavegacion: 'PermisoTempNavegac1',
    contenedores: [
      {
        tipoContenedorId: 'CM011',
        idCCPRelacionado: 'CCCBCD94-870A-4332-A52A-A52AA52AA52A',
        placaVMCCP: 'JNG7683',
        fechaCertificacionCCP: '2024-06-20T11:11:00',
        pesoContenedorVacio: 0,
        pesoNetoMercancia: 1,
        remolquesCCP: [
          { subTipoRemCCPId: 'CTR001', placaCCP: 'JNG7636' }
        ]
      }
    ]
  };
}

function makeMaritimeFigure() {
  return {
    tipoFiguraId: '02',
    rfcFigura: 'EKU9003173C9',
    nombreFigura: 'NombreFigura',
    partesTransporte: [
      { parteTransporteId: 'PT02' }
    ],
    domicilio: {
      calle: 'calle',
      numeroExterior: '211',
      coloniaId: '0814',
      localidadId: '01',
      referencia: 'casa blanca',
      municipioId: '010',
      estadoId: 'ZAC',
      paisId: 'MEX',
      codigoPostalId: '99080'
    }
  };
}

// ============================================================================
// FUNCION PRINCIPAL
// ============================================================================
async function main(): Promise<void> {
  console.log('=== Ejemplos de Factura con Complemento Carta Porte FiscalAPI (ByReference) ===\n');

  const client = FiscalapiClient.create(settings);

  try {
    // Descomentar el caso de uso que se desea ejecutar

    await facturaIngresoAutotransporteNacional(client);
    // await facturaIngresoAutotransporteNacionalConImpuestos(client);
    // await facturaIngresoAutotransporteExtranjero(client);
    // await facturaIngresoAutotransporteInternacionalAduanero(client);
    // await facturaIngresoTransporteFerroviarioNacional(client);
    // await facturaIngresoTransporteFerroviarioExtranjero(client);
    // await facturaIngresoTransporteFerroviarioInternacionalAduanero(client);
    // await facturaIngresoTransporteAereoNacional(client);
    // await facturaIngresoTransporteAereoExtranjero(client);
    // await facturaIngresoTransporteAereoInternacionalAduanero(client);
    // await facturaIngresoTransporteMAritimoNacional(client);
    // await facturaIngresoTransporteMAritimoExtranjero(client);
    // await facturaIngresoTransporteMAritimoInternacionalAduanero(client);
    // await facturaTrasladoAutotransporteNacional(client);
    // await facturaTrasladoAutotransporteExtranjero(client);
    // await facturaTrasladoAutotransporteInternacionalAduanero(client);
    // await facturaTrasladoTransporteFerroviarioNacional(client);
    // await facturaTrasladoTransporteFerroviarioExtranjero(client);
    // await facturaTrasladoTransporteFerroviarioInternacionalAduanero(client);
    // await facturaTrasladoTransporteAereoNacional(client);
    // await facturaTrasladoTransporteAereoExtranjero(client);
    // await facturaTrasladoTransporteAereoInternacionalAduanero(client);
    // await facturaTrasladoTransporteMAritimoNacional(client);
    // await facturaTrasladoTransporteMAritimoExtranjero(client);
    // await facturaTrasladoTransporteMAritimoInternacionalAduanero(client);

    console.log('\nEjecuci�n completada.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar funci�n principal
main();

