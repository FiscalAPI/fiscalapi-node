/**
 * Ejemplos de facturas con complemento Carta Porte (CFDI 4.0) usando el SDK de FiscalAPI
 * Todos los métodos usan el modo "ByValues" - los datos se pasan directamente en la petición HTTP
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
const currentDate = '2026-03-20T10:04:06';

// ============================================================================
// 1. FACTURA INGRESO - AUTOTRANSPORTE NACIONAL (ByValues)
// ============================================================================
async function facturaIngresoAutotransporteNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Nacional (ByValues) ===\n');

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
        registroISTMOId: 'Sí',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 2. FACTURA INGRESO - AUTOTRANSPORTE NACIONAL CON IMPUESTOS (ByValues)
// ============================================================================
async function facturaIngresoAutotransporteNacionalConImpuestos(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Nacional con Impuestos (ByValues) ===\n');

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
        registroISTMOId: 'Sí',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 3. FACTURA INGRESO - AUTOTRANSPORTE EXTRANJERO / EXPORTACIÓN (ByValues)
// ============================================================================
async function facturaIngresoAutotransporteExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Extranjero - Exportación (ByValues) ===\n');

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
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 1,
        registroISTMOId: 'Sí',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 4. FACTURA INGRESO - AUTOTRANSPORTE INTERNACIONAL ADUANERO / IMPORTACIÓN (ByValues)
// ============================================================================
async function facturaIngresoAutotransporteInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Autotransporte Internacional Aduanero - Importación (ByValues) ===\n');

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
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 1,
        registroISTMOId: 'Sí',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 5. FACTURA INGRESO - TRANSPORTE FERROVIARIO NACIONAL (ByValues)
// ============================================================================
async function facturaIngresoTransporteFerroviarioNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Ferroviario Nacional (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 6. FACTURA INGRESO - TRANSPORTE FERROVIARIO EXTRANJERO (ByValues)
// ============================================================================
async function facturaIngresoTransporteFerroviarioExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Ferroviario Extranjero - Exportación (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 7. FACTURA INGRESO - TRANSPORTE FERROVIARIO INTERNACIONAL ADUANERO (ByValues)
// ============================================================================
async function facturaIngresoTransporteFerroviarioInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Ferroviario Internacional Aduanero - Importación (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 8. FACTURA INGRESO - TRANSPORTE AÉREO NACIONAL (ByValues)
// ============================================================================
async function facturaIngresoTransporteAereoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Aéreo Nacional (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 9. FACTURA INGRESO - TRANSPORTE AÉREO EXTRANJERO (ByValues)
// ============================================================================
async function facturaIngresoTransporteAereoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Aéreo Extranjero (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 10. FACTURA INGRESO - TRANSPORTE AÉREO INTERNACIONAL ADUANERO (ByValues)
// ============================================================================
async function facturaIngresoTransporteAereoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Aéreo Internacional Aduanero (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 11. FACTURA INGRESO - TRANSPORTE MARÍTIMO NACIONAL (ByValues)
// ============================================================================
async function facturaIngresoTransporteMAritimoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Marítimo Nacional (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 12. FACTURA INGRESO - TRANSPORTE MARÍTIMO EXTRANJERO (ByValues)
// ============================================================================
async function facturaIngresoTransporteMAritimoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Marítimo Extranjero (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 13. FACTURA INGRESO - TRANSPORTE MARÍTIMO INTERNACIONAL ADUANERO (ByValues)
// ============================================================================
async function facturaIngresoTransporteMAritimoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso Transporte Marítimo Internacional Aduanero (ByValues) ===\n');

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
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '01',
        totalDistRec: 0,
        unidadPesoId: 'XBX',
        pesoNetoTotal: 1,
        registroISTMOId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 14. FACTURA TRASLADO - AUTOTRANSPORTE NACIONAL (ByValues)
// ============================================================================
async function facturaTrasladoAutotransporteNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Autotransporte Nacional (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 1,
        pesoNetoTotal: 0,
        registroISTMOId: 'Sí',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 15. FACTURA TRASLADO - AUTOTRANSPORTE EXTRANJERO (ByValues)
// ============================================================================
async function facturaTrasladoAutotransporteExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Autotransporte Extranjero - Exportación (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 0,
        registroISTMOId: 'Sí',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 16. FACTURA TRASLADO - AUTOTRANSPORTE INTERNACIONAL ADUANERO (ByValues)
// ============================================================================
async function facturaTrasladoAutotransporteInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Autotransporte Internacional Aduanero - Importación (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'SerieCCP31',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '01',
        totalDistRec: 1,
        pesoNetoTotal: 0,
        registroISTMOId: 'Sí',
        ubicacionPoloOrigenId: '01',
        ubicacionPoloDestinoId: '01',
        unidadPesoId: 'XBX',
        logisticaInversaRecoleccionDevolucionId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 17. FACTURA TRASLADO - TRANSPORTE FERROVIARIO NACIONAL (ByValues)
// ============================================================================
async function facturaTrasladoTransporteFerroviarioNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Ferroviario Nacional (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'No',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 18. FACTURA TRASLADO - TRANSPORTE FERROVIARIO EXTRANJERO (ByValues)
// ============================================================================
async function facturaTrasladoTransporteFerroviarioExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Ferroviario Extranjero - Exportación (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Salida',
        paisOrigenDestinoId: 'USA',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 19. FACTURA TRASLADO - TRANSPORTE FERROVIARIO INTERNACIONAL ADUANERO (ByValues)
// ============================================================================
async function facturaTrasladoTransporteFerroviarioInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Ferroviario Internacional Aduanero - Importación (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
        entradaSalidaMercId: 'Entrada',
        paisOrigenDestinoId: 'AFG',
        viaEntradaSalidaId: '04',
        totalDistRec: 500,
        pesoNetoTotal: 10,
        registroISTMOId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 20. FACTURA TRASLADO - TRANSPORTE AÉREO NACIONAL (ByValues)
// ============================================================================
async function facturaTrasladoTransporteAereoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Aéreo Nacional (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 21. FACTURA TRASLADO - TRANSPORTE AÉREO EXTRANJERO (ByValues)
// ============================================================================
async function facturaTrasladoTransporteAereoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Aéreo Extranjero (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 22. FACTURA TRASLADO - TRANSPORTE AÉREO INTERNACIONAL ADUANERO (ByValues)
// ============================================================================
async function facturaTrasladoTransporteAereoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Aéreo Internacional Aduanero - Importación (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 23. FACTURA TRASLADO - TRANSPORTE MARÍTIMO NACIONAL (ByValues)
// ============================================================================
async function facturaTrasladoTransporteMAritimoNacional(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Marítimo Nacional (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 24. FACTURA TRASLADO - TRANSPORTE MARÍTIMO EXTRANJERO (ByValues)
// ============================================================================
async function facturaTrasladoTransporteMAritimoExtranjero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Marítimo Extranjero (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// 25. FACTURA TRASLADO - TRANSPORTE MARÍTIMO INTERNACIONAL ADUANERO (ByValues)
// ============================================================================
async function facturaTrasladoTransporteMAritimoInternacionalAduanero(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Traslado Transporte Marítimo Internacional Aduanero - Importación (ByValues) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    currencyCode: 'XXX',
    typeCode: 'T',
    expeditionZipCode: '42501',
    series: 'Serie',
    date: currentDate,
    exchangeRate: 1,
    exportCode: '01',
    issuer: makeIssuer(),
    recipient: makeSelfRecipient(),
    items: [makeStandardItem()],
    complement: {
      lading: {
        transpInternacId: 'Sí',
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
            descripcion: 'Accesorios de equipo de telefonía',
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
// HELPERS COMPARTIDOS (Ferroviario / Aéreo)
// ============================================================================

function makeIssuer() {
  return {
    id: '0e82a655-5f0c-4e07-abab-8f322e4123ef'
  };
}

function makeSelfRecipient() {
  return {
    id: '37f7c342-d9a6-4881-9620-0da769b50ce5'
  };
}

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
  console.log('=== Ejemplos de Factura con Complemento Carta Porte FiscalAPI (ByValues) ===\n');

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

    console.log('\nEjecución completada.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar función principal
main();

