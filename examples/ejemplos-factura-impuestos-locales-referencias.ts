/**
 * Ejemplos de facturas con impuestos locales (CFDI complemento Impuestos Locales) usando el SDK de FiscalAPI
 * Todos los métodos usan el modo "ByReferences" - se envían IDs de entidades pre-configuradas en FiscalAPI
 */

import { FiscalapiClient, FiscalapiSettings, Invoice, InvoiceItem, ItemTax } from '../src/index';
import { inspect } from 'util';

// Configuración de la consola para mostrar objetos anidados
inspect.defaultOptions.depth = null;
inspect.defaultOptions.colors = true;

// Configuración de FiscalAPI
const settings: FiscalapiSettings = {
    // apiUrl: 'https://test.fiscalapi.com',
    // apiKey: '<API_KEY>',
    // tenant: '<TENANT_ID>',
    apiUrl: "http://localhost:5001",
    apiKey: "sk_development_b470ea83_3c0f_4209_b933_85223b960d91",
    tenant: "102e5f13-e114-41dd-bea7-507fce177281",
    debug: true
};

// IDs de personas pre-configuradas en FiscalAPI (modo ByReferences)
const currentDate = '2026-01-27T10:04:06';
const escuelaKemperUrgateId = "2e7b988f-3a2a-4f67-86e9-3f931dd48581";
const karlaFuenteNolascoId = "109f4d94-63ea-4a21-ab15-20c8b87d8ee9";

// Items comunes para las facturas de ingreso
const invoiceItems: InvoiceItem[] = [
  {
    itemCode: '01010101',
    quantity: '9.5',
    unitOfMeasurementCode: 'E48',
    description: 'Invoicing software as a service',
    unitPrice: '3587.75',
    taxObjectCode: '02',
    itemSku: '7506022301697',
    discount: '255.85',
    itemTaxes: [
      { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' } as ItemTax
    ]
  },
  {
    itemCode: '01010101',
    quantity: '8',
    unitOfMeasurementCode: 'E48',
    description: 'Software Consultant',
    unitPrice: '250.85',
    taxObjectCode: '02',
    itemSku: '7506022301698',
    discount: '255.85',
    itemTaxes: [
      { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' } as ItemTax
    ]
  },
  {
    itemCode: '01010101',
    quantity: '6',
    unitOfMeasurementCode: 'E48',
    description: 'Computer software',
    unitPrice: '1250.75',
    taxObjectCode: '02',
    itemSku: '7506022301699',
    itemTaxes: [
      { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' } as ItemTax,
      { taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.106666', taxFlagCode: 'R' } as ItemTax
    ]
  }
];

// ============================================================================
// 1. FACTURA INGRESO - IMPUESTOS LOCALES CEDULAR + ISH (ByReferences)
// ============================================================================
async function facturaImpuestosLocalesCedularIshByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso con Impuestos Locales CEDULAR + ISH (ByReferences) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentFormCode: '01',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    paymentMethodCode: 'PUE',
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: karlaFuenteNolascoId
    },
    items: invoiceItems,
    complement: {
      localTaxes: {
        taxes: [
          { taxName: 'CEDULAR', taxRate: '3.00', taxAmount: '6.00', taxFlagCode: 'R' },
          { taxName: 'ISH', taxRate: '8.00', taxAmount: '16.00', taxFlagCode: 'R' }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 2. FACTURA INGRESO - IMPUESTOS LOCALES CEDULAR (ByReferences)
// ============================================================================
async function facturaImpuestosLocalesCedularByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso con Impuestos Locales CEDULAR (ByReferences) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentFormCode: '01',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    paymentMethodCode: 'PUE',
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: karlaFuenteNolascoId
    },
    items: invoiceItems,
    complement: {
      localTaxes: {
        taxes: [
          { taxName: 'CEDULAR', taxRate: '3.00', taxAmount: '6.00', taxFlagCode: 'R' }
        ]
      }
    }
  };

  const response = await client.invoices.create(invoice);
  console.log('Response:', response);
}

// ============================================================================
// 3. FACTURA INGRESO - IMPUESTOS LOCALES ISH (ByReferences)
// ============================================================================
async function facturaImpuestosLocalesIshByReferences(client: FiscalapiClient): Promise<void> {
  console.log('\n=== Factura Ingreso con Impuestos Locales ISH (ByReferences) ===\n');

  const invoice: Invoice = {
    versionCode: '4.0',
    series: 'F',
    date: currentDate,
    paymentFormCode: '01',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode: '42501',
    paymentMethodCode: 'PUE',
    exchangeRate: 1,
    exportCode: '01',
    issuer: {
      id: escuelaKemperUrgateId
    },
    recipient: {
      id: karlaFuenteNolascoId
    },
    items: invoiceItems,
    complement: {
      localTaxes: {
        taxes: [
          { taxName: 'ISH', taxRate: '8.00', taxAmount: '16.00', taxFlagCode: 'R' }
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
  console.log('=== Ejemplos de Factura con Impuestos Locales FiscalAPI (ByReferences) ===\n');

  const client = FiscalapiClient.create(settings);

  try {
    // Descomentar el caso de uso que se desea ejecutar

    //await facturaImpuestosLocalesCedularIshByReferences(client);
    // await facturaImpuestosLocalesCedularByReferences(client);
     await facturaImpuestosLocalesIshByReferences(client);


    console.log('\nEjecución completada.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar función principal
main();
