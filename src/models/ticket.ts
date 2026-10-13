// src/models/ticket.ts

/**
 * Estados de un ticket, como llegan en `Ticket.status` (texto camelCase).
 * Un estado que esta versión del SDK no conoce llega tal cual, sin error.
 */
export const TicketStatus = {
  /** Ingerido y sin factura: lo puede facturar el receptor o entrar a una global. */
  Pending: 'pending',
  /** El receptor lo está facturando. */
  Invoicing: 'invoicing',
  /** Tiene su factura individual (`invoiceId`). */
  Invoiced: 'invoiced',
  /** Una factura global lo está timbrando. */
  Globalizing: 'globalizing',
  /** Está en una factura global (`globalInvoiceId`). */
  Globalized: 'globalized',
  /** Cancelado por el tenant antes de facturarse. */
  Cancelled: 'cancelled',
} as const;

/** Tipos de hecho de la historia de un ticket, como llegan en `TicketEvent.type`. */
export const TicketEventType = {
  Ingested: 'ingested',
  InvoicingStarted: 'invoicingStarted',
  Invoiced: 'invoiced',
  InvoiceRejected: 'invoiceRejected',
  OutcomeUnknown: 'outcomeUnknown',
  LeaseExpired: 'leaseExpired',
  Globalizing: 'globalizing',
  Globalized: 'globalized',
  ReleasedFromGlobal: 'releasedFromGlobal',
  Cancelled: 'cancelled',
  RecoveryFailed: 'recoveryFailed',
  Recovered: 'recovered',
  Resent: 'resent',
  ReturnedToPending: 'returnedToPending',
} as const;

/** Quién actuó en un hecho del ticket, como llega en `TicketEvent.actorType`. */
export const TicketActorType = {
  /** Una persona del tenant por la API o el dashboard. */
  Tenant: 'tenant',
  /** El receptor en el portal de autofactura. */
  Portal: 'portal',
  /** Un proceso en segundo plano de FiscalAPI. */
  System: 'system',
} as const;

/** Emisor de un ticket: una persona del tenant, por su id. */
export interface TicketIssuer {
  id: string;
}

/**
 * Impuesto de un concepto del ticket. Los decimales se envían tal cual: usa texto (`"0.160000"`) para conservar los
 * ceros finales.
 */
export interface TicketItemTax {
  /** Impuesto: 001 (ISR), 002 (IVA) o 003 (IEPS). */
  taxCode: string;

  /** Tipo de factor: Tasa, Cuota o Exento. */
  taxTypeCode: string;

  /** Tasa o cuota. */
  taxRate: number | string;

  /** "T" (traslado) o "R" (retención). */
  taxFlagCode: string;
}

/** Concepto de un ticket, con los nombres de los conceptos de las facturas (sin terceros, aduanas, predial ni partes). */
export interface TicketItem {
  /** Clave de producto o servicio (c_ClaveProdServ). */
  itemCode: string;

  /** Número de identificación (SKU) del producto en el punto de venta. */
  itemSku: string;

  quantity: number | string;

  /** Clave de unidad (c_ClaveUnidad). */
  unitOfMeasurementCode: string;

  description: string;

  unitPrice: number | string;

  /** Descuento del concepto. Opcional. */
  discount?: number | string;

  /** Objeto de impuesto (c_ObjetoImp): 02 exige impuestos; 01, 03, 04 y 05 no admiten. */
  taxObjectCode: string;

  itemTaxes: TicketItemTax[];
}

/** Un hecho de la historia del ticket (solo lectura; llega con `details = true`). */
export interface TicketEvent {
  /** Tipo de hecho en camelCase (ver `TicketEventType`); uno que el SDK no conoce llega tal cual. */
  type: string;

  occurredAt: string;

  /** Quién actuó, en camelCase (ver `TicketActorType`); uno que el SDK no conoce llega tal cual. */
  actorType: string;

  /** Factura del hecho; null si no aplica. */
  invoiceId?: string | null;
}

/**
 * Ticket de Auto CFDI: una venta pagada del punto de venta que el receptor puede autofacturar o que entra a una
 * factura global. Se envía en `tickets.create` (POST /api/v4/tickets) y llega en `tickets.getList` y
 * `tickets.getById`. Los miembros de solo lectura los asigna el API: al crear no se asignan.
 */
export interface Ticket {
  /** Id del ticket. Solo lectura. */
  id?: string;

  /** Emisor del ticket por referencia. Se envía al crear; no llega en las consultas. */
  issuer?: TicketIssuer;

  /** Persona emisora del tenant. Solo lectura (al crear se envía en `issuer`). */
  personId?: string;

  /** Folio del punto de venta (no es el folio del CFDI). */
  folio: string;

  /** Serie del punto de venta. Opcional. */
  series?: string | null;

  /** Momento del pago en hora civil de México sin zona: `yyyy-MM-ddTHH:mm:ss` (ver `formatSatDate`). */
  paymentDate: string;

  /** Forma de pago (c_FormaPago), por ejemplo 01 (efectivo). */
  paymentFormCode: string;

  /** Moneda (c_Moneda). Opcional: sin ella, el API usa MXN. */
  currencyCode?: string;

  /** Tipo de cambio. Opcional. */
  exchangeRate?: number | string | null;

  /** Código postal de expedición. Opcional: sin él, el API usa el del emisor. */
  expeditionZipCode?: string;

  /** Subtotal calculado por el API. Solo lectura. */
  subtotal?: number;

  /** Total de impuestos trasladados calculado por el API. Solo lectura. */
  totalTransferredTaxes?: number;

  /** Total de impuestos retenidos calculado por el API. Solo lectura. */
  totalWithheldTaxes?: number;

  /** Total que cobró el punto de venta: debe cuadrar al centavo con el calculado (si no, 422). */
  total: number | string;

  /** Estado en camelCase (ver `TicketStatus`); uno que el SDK no conoce llega tal cual. Solo lectura. */
  status?: string;

  /** Si hoy el receptor puede autofacturarlo. Solo lectura. */
  selfInvoiceEligible?: boolean;

  /** Último momento de la ventana de autofactura; null si no cierra. Solo lectura. */
  eligibleUntil?: string | null;

  /** Factura individual (estado invoiced). Solo lectura. */
  invoiceId?: string | null;

  /** Factura global (estado globalized). Solo lectura. */
  globalInvoiceId?: string | null;

  /** Fecha de alta. Solo lectura. */
  createdAt?: string;

  /** Conceptos. Obligatorios al crear; en las consultas solo llegan con `details = true`. */
  items?: TicketItem[];

  /** Historia del ticket en orden. Solo lectura; solo llega con `details = true`. */
  events?: TicketEvent[];
}

/**
 * Respuesta de `tickets.create`: la misma forma en el 201 de un ticket nuevo y en el 200 de una repetición con la
 * misma Idempotency-Key y el mismo cuerpo.
 */
export interface TicketIngestionResult {
  id: string;

  /** Código del ticket sin guiones, como lo lleva el QR; se imprime en grupos (XXXX-XXXX-XXXX). */
  ticketCode: string;

  /** URL del portal de autofactura que abre el ticket. */
  qrUrl: string;

  /** Estado actual en camelCase (al ingerir, `pending`). */
  status: string;

  selfInvoiceEligible: boolean;

  /** Último momento de la ventana de autofactura; null si no cierra. */
  eligibleUntil: string | null;

  subtotal: number;
  totalTransferredTaxes: number;
  totalWithheldTaxes: number;
  total: number;
}

/** Código de un ticket y la URL de su QR, para reimprimirlo (GET /api/v4/tickets/{id}/code). */
export interface TicketCodeResult {
  ticketCode: string;
  qrUrl: string;
}

/**
 * Filtros de `tickets.getList` (GET /api/v4/tickets). Cada filtro aplica solo si se asigna; los que no se asignan no
 * se envían. Los tickets llegan ordenados por fecha de pago.
 */
export interface TicketListFilters {
  /** Uno o más estados (ver `TicketStatus`); se envían repitiendo la llave `status`. */
  status?: string[];

  /** Persona emisora. */
  personId?: string;

  /** Con `true`, cada ticket trae sus conceptos con impuestos (sin la historia). */
  details?: boolean;

  /** Factura global que ampara los tickets. */
  globalInvoiceId?: string;

  /** Primer día del pago (incluido), en fecha civil de México `YYYY-MM-DD`. */
  from?: string;

  /** Último día del pago (incluido), en fecha civil de México `YYYY-MM-DD`. */
  to?: string;

  /** Página, desde 1. Sin ella, el API devuelve la primera. */
  pageNumber?: number;

  /** Tamaño de página (1 a 50). Sin él, el API usa 10. */
  pageSize?: number;
}
