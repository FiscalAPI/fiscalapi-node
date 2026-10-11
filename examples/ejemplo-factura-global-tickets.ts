/**
 * Factura global de tickets de Auto CFDI — POST /api/v4/invoices
 *
 * La global de tickets es una factura de ingreso estándar (`invoices.create`) con `globalInformation`, el emisor por
 * referencia (`issuer.id`) y `ticketId` en cada concepto. Cada ticket va en un concepto por grupo de objeto de impuesto e
 * impuestos (un ticket con IVA 16 % y 0 % lleva dos conceptos con el mismo `ticketId`), y la suma de sus conceptos debe
 * reflejar el ticket. Una global lleva una sola moneda, tipo de cambio y lugar de expedición, y hasta 1,500 conceptos:
 * este ejemplo asume tickets en MXN de un solo lugar de expedición. Una global sin `ticketId` no marca los tickets.
 */
import {
  ApiResponse,
  FiscalapiClient,
  FiscalapiSettings,
  IFiscalapiClient,
  Invoice,
  InvoiceItem,
  PagedList,
  Ticket,
  TicketItem,
  TicketListFilters,
  TicketStatus,
} from '../src/index';

// Configuración de FiscalAPI
const settings: FiscalapiSettings = {
  apiUrl: 'https://test.fiscalapi.com', // https://live.fiscalapi.com
  apiKey: '<api-key>', // API key de FiscalAPI
  tenant: '<tenant>', // Tenant de FiscalAPI
  debug: true // true, imprime raw request y response en consola, util durante el desarrollo de la integración.
};

// Id de la persona emisora (con CSD)
const issuerId: string = '<person-id>';

// Millonésimas enteras: los importes del CFDI llevan 6 decimales y sumar en enteros evita 0.1 + 0.2 = 0.30000000000000004.
const MICROS: number = 1000000;

function toMicros(value: number | string): number {
  return Math.round(Number(value) * MICROS);
}

function fromMicros(micros: number): string {
  return (micros / MICROS).toFixed(6);
}

// ============================================================
// 1. Tickets pendientes del emisor en el periodo, con sus conceptos
// ============================================================
async function pendingTickets(client: IFiscalapiClient): Promise<Ticket[]> {
  const tickets: Ticket[] = [];
  for (let pageNumber = 1; ; pageNumber++) {
    const filters: TicketListFilters = {
      status: [TicketStatus.Pending],
      personId: issuerId,
      from: '2026-09-01',
      to: '2026-09-30',
      pageNumber,
      pageSize: 50,
    };
    const page: ApiResponse<PagedList<Ticket>> = await client.tickets.getList(filters);
    if (!page.succeeded) {
      throw new Error(`Error ${page.httpStatusCode}: ${page.details}`);
    }
    for (const summary of page.data.items) {
      const detail: ApiResponse<Ticket> = await client.tickets.getById(summary.id ?? '', true);
      tickets.push(detail.data);
    }
    if (!page.data.hasNextPage) {
      return tickets;
    }
  }
}

// ============================================================
// 2. Un concepto por ticket y grupo de impuestos
// ============================================================

// Objeto de impuesto e impuestos de un concepto, sin importar el orden de los impuestos.
function taxSignature(item: TicketItem): string {
  const taxes: string[] = item.itemTaxes
    .map(tax => [tax.taxCode, tax.taxTypeCode, Number(tax.taxRate).toFixed(6), tax.taxFlagCode].join('|'))
    .sort();
  return [item.taxObjectCode, ...taxes].join(';');
}

// Valor unitario = suma de cantidad × valor unitario (6 decimales por concepto); descuento = suma de descuentos.
function ticketConcepts(ticket: Ticket): InvoiceItem[] {
  const groups: Map<string, TicketItem[]> = new Map<string, TicketItem[]>();
  for (const item of ticket.items ?? []) {
    const key: string = taxSignature(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.values()].map((items: TicketItem[]): InvoiceItem => ({
    ticketId: ticket.id,
    itemCode: '01010101',
    itemSku: ticket.folio, // NoIdentificacion: folio del ticket
    quantity: 1,
    unitOfMeasurementCode: 'ACT',
    description: 'Venta',
    unitPrice: fromMicros(items.reduce((sum, item) => sum + Math.round(Number(item.quantity) * Number(item.unitPrice) * MICROS), 0)),
    discount: fromMicros(items.reduce((sum, item) => sum + toMicros(item.discount ?? 0), 0)),
    taxObjectCode: items[0].taxObjectCode,
    itemTaxes: items[0].itemTaxes.map(({ taxCode, taxTypeCode, taxRate, taxFlagCode }) =>
      ({ taxCode, taxTypeCode, taxRate, taxFlagCode })),
  }));
}

// ============================================================
// 3. La factura global
// ============================================================
function globalInvoice(tickets: Ticket[]): Invoice {
  const expeditionZipCode: string = tickets[0].expeditionZipCode ?? '';
  // Forma de pago de la global: la del ticket de mayor monto.
  const largest: Ticket = tickets.reduce((max, ticket) => Number(ticket.total) > Number(max.total) ? ticket : max);
  return {
    versionCode: '4.0',
    series: 'G',
    date: '2026-10-01T10:00:00',
    paymentFormCode: largest.paymentFormCode,
    paymentMethodCode: 'PUE',
    currencyCode: 'MXN',
    typeCode: 'I',
    expeditionZipCode,
    exportCode: '01',
    issuer: { id: issuerId },
    recipient: {
      tin: 'XAXX010101000',
      legalName: 'PUBLICO EN GENERAL',
      zipCode: expeditionZipCode,
      taxRegimeCode: '616',
      cfdiUseCode: 'S01',
    },
    globalInformation: { periodicityCode: '04', monthCode: '09', year: 2026 },
    items: tickets.flatMap(ticketConcepts),
  };
}

async function main(): Promise<void> {
  const client: IFiscalapiClient = FiscalapiClient.create(settings);

  try {
    const tickets: Ticket[] = await pendingTickets(client);
    if (tickets.length === 0) {
      console.log('No hay tickets pendientes en el periodo.');
      return;
    }

    const response: ApiResponse<Invoice> = await client.invoices.create(globalInvoice(tickets));
    if (response.succeeded) {
      console.log(`Global timbrada: ${response.data.uuid}`);
    } else if (response.httpStatusCode === 409) {
      // Algún ticket ya no estaba pendiente: details trae el cuerpo del error con data.unavailableTickets
      // ([{ ticketId, status }]). No se cobró el timbre ni quedó tomado ningún ticket.
      console.log('Tickets no disponibles:', response.details);
    } else {
      // 400 en items[i].ticketId: los conceptos de ese ticket no lo reflejan (importes, descuentos o impuestos).
      console.log(`Error ${response.httpStatusCode}:`, response.details);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
