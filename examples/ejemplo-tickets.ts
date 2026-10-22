/**
 * Tickets de Auto CFDI — POST/GET/DELETE /api/v4/tickets
 *
 * El punto de venta ingiere cada venta pagada como ticket (cobra 1 crédito de ticket) e imprime su código y QR; el
 * receptor lo autofactura en el portal o el tenant lo junta en una factura global. Con la lista filtrada el tenant
 * recupera los tickets pendientes de un periodo.
 */
import { randomUUID } from 'crypto';
import {
  ApiResponse,
  FiscalapiClient,
  FiscalapiSettings,
  IFiscalapiClient,
  PagedList,
  Ticket,
  TicketCodeResult,
  TicketIngestionResult,
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

// Id de la persona emisora (con CSD y créditos de ticket)
const issuerId: string = '<person-id>';

// ============================================================
// 1. Ingerir un ticket con Idempotency-Key
//    Repetir la misma llave de idempotencia con el mismo cuerpo, dentro de 24 h, devuelve la respuesta original (201)
//    y no cobra otra vez.
// ============================================================
async function ingerirTicket(client: IFiscalapiClient): Promise<string | undefined> {
  const ticket: Ticket = {
    issuer: { id: issuerId },
    folio: 'F-1001',
    series: 'A',
    paymentDate: '2026-10-15T12:30:00', // hora civil de México, sin zona
    paymentFormCode: '01',
    total: '116.00', // debe cuadrar al centavo con los conceptos e impuestos
    items: [
      {
        itemCode: '50202306',
        itemSku: 'SKU-1',
        quantity: 1,
        unitOfMeasurementCode: 'H87',
        description: 'Refresco',
        unitPrice: '100.00',
        taxObjectCode: '02',
        itemTaxes: [{ taxCode: '002', taxTypeCode: 'Tasa', taxRate: '0.160000', taxFlagCode: 'T' }],
      },
    ],
  };

  // Una llave de idempotencia por operación: guárdala para reintentar el mismo ticket
  const idempotencyKey: string = randomUUID();
  const respuesta: ApiResponse<TicketIngestionResult> = await client.tickets.create(ticket, idempotencyKey);
  if (!respuesta.succeeded) {
    // 409: folio y serie ya activos; 422: total que no cuadra, emisor sin CSD o sin créditos de ticket, etc.
    // details trae el cuerpo del error en JSON, con su data (existingTicketId, expectedTotal, computedTotal).
    console.log(`Error ${respuesta.httpStatusCode}:`, respuesta.details);
    return undefined;
  }

  // Se imprime en el ticket de venta: el código en grupos (XXXX-XXXX-XXXX) y el QR con la URL del portal.
  console.log(`Código: ${respuesta.data.ticketCode} QR: ${respuesta.data.qrUrl}`);
  return respuesta.data.id;
}

// ============================================================
// 2. Tickets pendientes de un emisor en un mes (para la factura global)
// ============================================================
async function listarPendientes(client: IFiscalapiClient): Promise<void> {
  const filtros: TicketListFilters = {
    status: [TicketStatus.Pending],
    personId: issuerId,
    from: '2026-10-01',
    to: '2026-10-31',
    pageNumber: 1,
    pageSize: 50,
  };

  const respuesta: ApiResponse<PagedList<Ticket>> = await client.tickets.getList(filtros);
  if (respuesta.succeeded) {
    respuesta.data.items.forEach((ticket: Ticket) => {
      console.log(`- ${ticket.series ?? ''}${ticket.folio} ${ticket.paymentDate} ${ticket.total} ${ticket.status}`);
    });
  }
}

// ============================================================
// 3. Detalle, reimpresión del código y cancelación
// ============================================================
async function consultarYCancelar(client: IFiscalapiClient, ticketId: string): Promise<void> {
  const detalle: ApiResponse<Ticket> = await client.tickets.getById(ticketId, true);
  console.log('Detalle con conceptos e historia:', detalle);

  const codigo: ApiResponse<TicketCodeResult> = await client.tickets.getCode(ticketId);
  console.log('Código para reimprimir:', codigo);

  // Solo se cancela un ticket en estado pending; el crédito de ticket no se devuelve.
  const cancelado: ApiResponse<boolean> = await client.tickets.cancel(ticketId);
  console.log('Cancelado:', cancelado);
}

async function main(): Promise<void> {
  const client: IFiscalapiClient = FiscalapiClient.create(settings);

  try {
    const ticketId: string | undefined = await ingerirTicket(client);
    await listarPendientes(client);
    if (ticketId) {
      await consultarYCancelar(client, ticketId);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
