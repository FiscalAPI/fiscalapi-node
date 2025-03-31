import { DateTime } from 'luxon';
 
// src/models/invoice.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo factura
 * Contiene toda la información de una factura, como datos del emisor, receptor, 
 * productos/servicios, importes, método de pago, el tipo de factura, entre otros.
 */
export interface Invoice {
  /** Código de la versión de la facura. Default: "4.0" */
  versionCode?: string;

  /** Es el número de serie que utiliza el contribuyente para control interno de su información */
  series: string;

  /** Es la fecha y hora de expedición del comprobante fiscal. Se expresa en la forma AAAA-MM-DDThh:mm:ss */
  date: DateTime | string;

  /** Consecutivo de facturas por cuenta. Se incrementa con cada factura generada en tu cuenta de Fiscalapi */
  consecutive?: number;

  /** Consecutivo de facturas por RFC emisor. Se incrementa por cada factura generada por el mismo RFC emisor */
  number?: number;

  /** Subtotal de la factura. Campo de solo lectura */
  subtotal?: number;

  /** Descuento aplicado a la factura. Campo de solo lectura */
  discount?: number;

  /** Total de la factura. Campo de solo lectura */
  total?: number;

  /** UUID de la factura, es el folio fiscal asignado por el SAT al momento del timbrado */
  uuid?: string;

  /** Código de la forma de pago para la factura. Catálogo del SAT c_FormaPago */
  paymentFormCode?: string;

  /** Código de la moneda utilizada para expresar los montos. Default: "MXN" */
  currencyCode: string;

  /** Código de tipo de factura. Catálogo del SAT c_TipoDeComprobante */
  typeCode: string;

  /** Código postal del emisor */
  expeditionZipCode: string;

  /** Código que se identifica si la factura ampara una operación de exportación. Default: "01" */
  exportCode: string;

  /** Código de método para la factura de pago del catálogo del SAT c_MetodoPago */
  paymentMethodCode?: string;

  /** Tipo de cambio FIX conforme a la moneda registrada en la factura. Default: 1 */
  exchangeRate?: number;

  /** El emisor de la factura */
  issuer: InvoiceIssuer;

  /** Receptor de la factura */
  recipient: InvoiceRecipient;

  /** Conceptos de la factura (productos o servicios) */
  items?: InvoiceItem[];

  /** Informacion global. Utilizado cuando se genera una factura global */
  globalInformation?: GlobalInformation;

  /** Facturas relacionadas */
  relatedInvoices?: RelatedInvoice[];

  /** Pago o pagos recibidos para liquidar parcial o totalmente una factura de ingreso emitida previamente */
  payments?: InvoicePayment[];

  /** Respuesta del SAT. Contiene la información del timbrado. (Sólo lectura) */
  responses?: InvoiceResponse[];
}

/**
 * Emisor de la factura
 */
export interface InvoiceIssuer {
  /** ID de la persona (emisora) en fiscalapi */
  id?: string;

  /** RFC del emisor (Tax Identification Number) */
  tin?: string;

  /** Razón social del emisor sin regimen de capital */
  legalName?: string;

  /** Código del régimen fiscal del emisor. Catálogo del SAT c_RegimenFiscal */
  taxRegimeCode?: string;

  /** Sellos del emisor (archivos .cer y .key) */
  taxCredentials?: TaxCredential[];
}

/**
 * Sellos del emisor
 */
export interface TaxCredential {
  /** Archivo en formato base64 */
  base64File: string;

  /** Tipo de archivo. 0: Cetifiacdo CSD (archivo .cer), 1: Llave privada (archivo .key) */
  fileType: number;

  /** Contraseña del archivo .key. Debe ser la misma en ambos objetos (.cer y .key) */
  password: string;
}

/**
 * Receptor de la factura
 */
export interface InvoiceRecipient {
  /** ID de la persona (receptora) en fiscalapi */
  id?: string;

  /** RFC del receptor (Tax Identification Number) */
  tin?: string;

  /** Razón social del receptor sin regimen de capital */
  legalName?: string;

  /** Código del régimen fiscal del receptor. Catálogo del SAT c_RegimenFiscal */
  taxRegimeCode?: string;

  /** Código del uso CFDI. Catálogo del SAT c_UsoCFDI */
  cfdiUseCode?: string;

  /** Código postal del receptor */
  zipCode?: string;

  /** Correo electrónico del receptor. Para enviar la factura desde el dasborard */
  email?: string;
}

/**
 * Conceptos de la factura (productos o servicios)
 */
export interface InvoiceItem {
  /** ID del producto en fiscalapi */
  id?: string;

  /** Código del producto o servicio del catálogo c_ClaveProdServ */
  itemCode?: string;

  /** Cantidad del producto o servicio */
  quantity: number | string;

  /** Cantidad monetaria del descuento aplicado al producto o servicio */
  discount?: number | string;

  /** Código de la unidad de medida del producto o servicio. Catálogo c_ClaveUnidad */
  unitOfMeasurementCode?: string;

  /** Descripción del producto o servicio */
  description?: string;

  /** Precio unitario del producto o servicio. (Sin impuestos) */
  unitPrice?: number | string;

  /** Código de obligaciones de impuesto aplicables al producto o servicio. Catálogo c_ObjetoImp */
  taxObjectCode?: string;

  /** SKU o clave del sistema externo que identifica al producto o servicio */
  itemSku?: string;

  /** Impuestos aplicables al producto o servicio */
  itemTaxes?: ItemTax[];
}

/**
 * Impuestos aplicables al producto o servicio
 */
export interface ItemTax {
  /** Código del impuesto. Catálogo del SAT c_Impuesto */
  taxCode: string;

  /** Tipo de factor. Catálogo del SAT c_TipoFactor */
  taxTypeCode: string;

  /** Tasa del impuesto. Catálogo del SAT c_TasaOCuota  */
  taxRate?: string | number; 

  /** Código que indica la naturaleza del impuesto. "T": Impuesto Traslado, "R": Impuesto Retenido */
  taxFlagCode: string;
}



/**
 * Informacion global para factura global
 */
export interface GlobalInformation {
  /** Código de la periodicidad de la factura global. Catálogo del SAT c_Periodicidad */
  periodicityCode: string;

  /** Código del mes de la factura global. Catálogo del SAT c_Meses */
  monthCode: string;

  /** Año de la factura global a 4 dígitos */
  year: number;
}

/**
 * Facturas relacionadas
 */
export interface RelatedInvoice {
  /** Código de la relación de la factura relacionada. Catálogo del SAT c_TipoRelacion */
  relationshipTypeCode: string;

  /** UUID de la factura relacionada */
  uuid: string;
}

/**
 * Pago o pagos recibidos
 */
export interface InvoicePayment {
  /** Fecha de pago. Se expresa en la forma AAAA-MM-DDThh:mm:ss */
  paymentDate: string;

  /** Código de la forma de pago del pago recibido. Catálogo del SAT c_FormaPago */
  paymentFormCode: string;

  /** Código de la moneda utilizada en el pago. Catálogo del SAT c_Moneda. Default: "MXN" */
  currencyCode: string;

  /** Tipo de cambio FIX conforme a la moneda registrada en la factura. Default: 1 */
  exchangeRate?: number | string;

  /** Monto del pago */
  amount: number | string;

  /** RFC del banco origen. (Rfc del banco emisor del pago) */
  sourceBankTin: string;

  /** Cuenta bancaria origen. (Cuenta bancaria del banco emisor del pago) */
  sourceBankAccount: string;

  /** RFC del banco destino. (Rfc del banco receptor del pago) */
  targetBankTin: string;

  /** Cuenta bancaria destino (Cuenta bancaria del banco receptor del pago) */
  targetBankAccount: string;

  /** Facturas pagadas con el pago recibido */
  paidInvoices: PaidInvoice[];
}

/**
 * Facturas pagadas con el pago recibido
 */
export interface PaidInvoice {
  /** UUID de la factura pagada */
  uuid: string;

  /** Serie de la factura pagada */
  series: string;

  /** Monto pagado pagado en la factura */
  paymentAmount: number | string;

  /** Folio de la factura pagada */
  number: string;

  /** Código de la moneda utilizada en la factura pagada. Default: "MXN" */
  currencyCode: string;

  /** Número de parcialidad */
  partialityNumber: number ;

  /** Subtotal de la factura pagada */
  subTotal: number | string;

  /** Saldo anterior de la factura pagada */
  previousBalance: number | string;

  /** Saldo restante de la factura pagada */
  remainingBalance: number | string;

  /** Código de obligaciones de impuesto aplicables a la factura pagada */
  taxObjectCode: string;

  /** Equivalencia de la moneda. Default: 1 */
  equivalence?: number | string;

  /** Impuestos aplicables a la factura pagada */
  paidInvoiceTaxes: PaidInvoiceTax[];
}

/**
 * Impuestos aplicables a la factura pagada
 */
export interface PaidInvoiceTax {
 
  /** Código del impuesto. Catálogo del SAT c_Impuesto */
  taxCode: string;

  /** Tipo de factor. Catálogo del SAT c_TipoFactor */
  taxTypeCode: string;

  /** Tasa del impuesto. Catálogo del SAT c_TasaOCuota */
  taxRate: number | string;

  /** Código que indica la naturaleza del impuesto. "T": Impuesto Traslado, "R": Impuesto Retenido */
  taxFlagCode: string;
}

/**
 * Respuesta del SAT. Contiene la información del timbrado
 */
export interface InvoiceResponse {
  /** ID de la respuesta */
  id?: string;

  /** ID de la factura a la que pertenece la respuesta */
  invoiceId?: string;

  /** Folio Fiscal (UUID) proporcionado por el SAT tras el timbrado de la factura */
  invoiceUuid?: string;

  /** Número de certificado del emisor */
  invoiceCertificateNumber?: string;

  /** Sello digital del CFDI en formato Base64 */
  invoiceBase64Sello?: string;

  /** Fecha y hora de la firma electrónica del CFDI por parte del emisor */
  invoiceSignatureDate?: Date;

  /** Imagen del código QR en formato Base64 */
  invoiceBase64QrCode?: string;

  /** XML de la factura en formato Base64 */
  invoiceBase64?: string;

  /** Sello digital del SAT en formato Base64 */
  satBase64Sello?: string;

  /** Cadena original de la factura codificado en Base64 */
  satBase64OriginalString?: string;

  /** Número de certificado del SAT */
  satCertificateNumber?: string;
}

/**
 * Modelo de cancelación de facturas
 */
export interface CancelInvoiceRequest {
  /** ID de la factura a cancelar */
  id?: string;

  /** UUID de la factura a cancelar */
  invoiceUuid?: string;

  /** RFC del emisor de la factura (Tax Identification Number) */
  tin?: string;

  /** Código del motivo de cancelación de la factura */
  cancellationReasonCode: string;

  /** UUID de la factura que sustituye a la factura cancelada */
  replacementUuid?: string;

  /** Sellos del emisor (archivos .cer y .key) */
  taxCredentials?: TaxCredential[];
}

/**
 * Modelo de respuesta de cancelación de facturas
 */
export interface CancelInvoiceResponse {
  /** Acuse de cancelación en formato base64 */
  base64CancellationAcknowledgement?: string;

  /** Diccionario de UUIDs de facturas con su respectivo código de estatus de cancelación */
  invoiceUuids?: Record<string, string>;
}

/**
 * Modelo de generación de pdf
 */
export interface CreatePdfRequest {
  /** ID de la factura para la cual se generará el PDF */
  invoiceId: string;

  /** Color de la banda del PDF en formato hexadecimal */
  bandColor?: string;

  /** Color de la fuente del texto sobre la banda en formato hexadecimal */
  fontColor?: string;

  /** Logotipo en formato base64 que se mostrará en el PDF */
  base64Logo?: string;
}



/**
 * Modelo de envío facturas por correo
 */
export interface SendInvoiceRequest {
  /** ID de la factura para la cual se generará el PDF */
  invoiceId: string;

  /** Correo electrónico del destinatario */
  toEmail: string;

  /** Color de la banda del PDF en formato hexadecimal */
  bandColor?: string;

  /** Color de la fuente del texto sobre la banda en formato hexadecimal */
  fontColor?: string;

  /** Logotipo en formato base64 que se mostrará en el PDF */
  base64Logo?: string;
}

/**
 * Modelo para consultar estado de facturas
 */
export interface InvoiceStatusRequest {
  /** Id de la factura a consultar */
  id?: string;

  /** RFC Emisor la factura */
  issuerTin?: string;

  /** RFC Receptor de la factura */
  recipientTin?: string;

  /** Total de la factura */
  invoiceTotal?: number;

  /** Folio fiscal factura a consultar */
  invoiceUuid?: string;

  /** Últimos ocho caracteres del sello digital del emisor */
  last8DigitsIssuerSignature?: string;
}

/**
 * Modelo de respuesta de consulta de estado de facturas
 */
export interface InvoiceStatusResponse {
  /** Código de estatus retornado por el SAT */
  statusCode: string;

  /** Estado actual de la factura. Posibles valores: 'Vigente' | 'Cancelado' | 'No Encontrado' */
  status: string;

  /** Indica si la factura es cancelable. Posibles valores: 'Cancelable con aceptación' | 'No cancelable' | 'Cancelable sin aceptación' */
  cancelableStatus: string;

  /** Detalle del estatus de cancelación */
  cancellationStatus: string;

  /** Codigo que indica si el RFC Emisor se encuentra dentro de la lista negra de EFOS */
  efosValidation: string;
}