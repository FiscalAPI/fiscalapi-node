 
// src/models/invoice.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo de factura
 */
export class Invoice extends BaseDto {
  /** Versión del CFDI */
  versionCode?: string = '4.0';
  
  /** Serie de la factura */
  series?: string;
  
  /** Número de la factura */
  number?: string;
  
  /** Fecha de la factura */
  date?: Date;
  
  /** Código de forma de pago */
  paymentFormCode?: string;
  
  /** Código de moneda */
  currencyCode?: string = 'MXN';
  
  /** Código de tipo de comprobante */
  typeCode?: string = 'I';
  
  /** Código postal de expedición */
  expeditionZipCode?: string;
  
  /** Código de exportación */
  exportCode?: string = '01';
  
  /** Datos del emisor */
  issuer?: InvoiceIssuer;
  
  /** Datos del receptor */
  recipient?: InvoiceRecipient;
  
  /** Facturas relacionadas */
  relatedInvoices?: RelatedInvoice[];
  
  /** Conceptos de la factura */
  items?: InvoiceItem[];
  
  /** Información global */
  globalInformation?: GlobalInformation;
  
  /** Addenda */
  addendum?: Addendum;
  
  /** Tipo de cambio */
  exchangeRate?: number = 1;
  
  /** Condiciones de pago */
  paymentConditions?: string;
  
  /** Confirmación del PAC */
  pacConfirmation?: string;
  
  /** Código de método de pago */
  paymentMethodCode?: string = 'PUE';
  
  /** Subtotal */
  subtotal?: number;
  
  /** Descuento */
  discount?: number;
  
  /** Total */
  total?: number;
  
  /** Respuestas de la factura */
  responses?: InvoiceResponse[];
  
  /** Pagos de la factura */
  payments?: InvoicePayment[];
}

/**
 * Emisor de la factura
 */
export class InvoiceIssuer extends BaseDto {
  /** RFC */
  tin?: string;
  
  /** Razón social */
  legalName?: string;
  
  /** Código de régimen fiscal */
  taxRegimeCode?: string;
  
  /** Número de operación */
  operationNumber?: string;
  
  /** Credenciales fiscales */
  taxCredentials?: TaxCredential[];
}

/**
 * Credencial fiscal
 */
export interface TaxCredential {
  /** Archivo en base64 */
  base64File?: string;
  
  /** Tipo de archivo */
  fileType?: FileType;
  
  /** Contraseña */
  password?: string;
}

/**
 * Tipos de archivo fiscal
 */
export enum FileType {
    /** Certificado CSD */
    CertificateCsd = 'CertificateCsd',
    
    /** Llave privada CSD */
    PrivateKeyCsd = 'PrivateKeyCsd',
  }
  
  /**
   * Receptor de la factura
   */
  export class InvoiceRecipient extends BaseDto {
    /** RFC */
    tin?: string;
    
    /** Razón social */
    legalName?: string;
    
    /** Código postal */
    zipCode?: string;
    
    /** Código de país extranjero */
    foreignCountryCode?: string;
    
    /** RFC extranjero */
    foreignTin?: string;
    
    /** Código de régimen fiscal */
    taxRegimeCode?: string;
    
    /** Código de uso de CFDI */
    cfdiUseCode?: string;
    
    /** Correo electrónico */
    email?: string;
  }
  
  /**
   * Factura relacionada
   */
  export interface RelatedInvoice {
    /** Código de tipo de relación */
    relationshipTypeCode?: string;
    
    /** UUID */
    uuid?: string;
  }
  
  /**
   * Información global
   */
  export interface GlobalInformation {
    /** Código de periodicidad */
    periodicityCode?: string;
    
    /** Código de mes */
    monthCode?: string;
    
    /** Año */
    year?: number;
  }
  
  /**
   * Addenda
   */
  export interface Addendum {
    /** Cualquier contenido */
    any?: string;
  }
  
  /**
   * Concepto de factura
   */
  export class InvoiceItem extends BaseDto {
    /** Código del concepto */
    itemCode?: string;
    
    /** Cantidad */
    quantity?: number;
    
    /** Código de unidad de medida */
    unitOfMeasurementCode?: string;
    
    /** Descripción */
    description?: string;
    
    /** Precio unitario */
    unitPrice?: number;
    
    /** Código de objeto de impuesto */
    taxObjectCode?: string;
    
    /** SKU del concepto */
    itemSku?: string;
    
    /** Unidad de medida */
    unitOfMeasurement?: string;
    
    /** Descuento */
    discount?: number;
    
    /** Impuestos del concepto */
    itemTaxes?: InvoiceItemTax[];
  }
  
  /**
   * Impuesto de concepto de factura
   */
  export interface InvoiceItemTax {
    /** Código de impuesto */
    taxCode?: string;
    
    /** Código de tipo de impuesto */
    taxTypeCode?: string;
    
    /** Tasa de impuesto */
    taxRate?: number;
    
    /** Código de bandera de impuesto */
    taxFlagCode?: string;
  }
  
  /**
   * Pago de factura
   */
  export interface InvoicePayment {
    /** Fecha de pago */
    paymentDate?: Date;
    
    /** Código de forma de pago */
    paymentFormCode?: string;
    
    /** Código de moneda */
    currencyCode?: string;
    
    /** Tipo de cambio */
    exchangeRate?: number;
    
    /** Monto */
    amount?: number;
    
    /** Número de operación */
    operationNumber?: string;
    
    /** RFC del banco origen */
    sourceBankTin?: string;
    
    /** Cuenta del banco origen */
    sourceBankAccount?: string;
    
    /** RFC del banco destino */
    targetBankTin?: string;
    
    /** Cuenta del banco destino */
    targetBankAccount?: string;
    
    /** Nombre del banco extranjero */
    foreignBankName?: string;
    
    /** Código de tipo de pago */
    paymentTypeCode?: string;
    
    /** Certificado de pago en base64 */
    base64PaymentCertificate?: string;
    
    /** Cadena original del pago */
    paymentOriginalString?: string;
    
    /** Valor de la firma */
    signatureValue?: string;
    
    /** Facturas pagadas */
    paidInvoices?: PaidInvoice[];
  }
  
  /**
   * Factura pagada
   */
  export interface PaidInvoice {
    /** UUID */
    uuid?: string;
    
    /** Serie */
    series?: string;
    
    /** Número */
    number?: string;
    
    /** Código de moneda */
    currencyCode?: string;
    
    /** Número de parcialidad */
    partialityNumber?: number;
    
    /** Subtotal */
    subTotal?: number;
    
    /** Saldo anterior */
    previousBalance?: number;
    
    /** Importe del pago */
    paymentAmount?: number;
    
    /** Saldo insoluto */
    remainingBalance?: number;
    
    /** Código de objeto de impuesto */
    taxObjectCode?: string;
    
    /** Equivalencia */
    equivalence?: number;
    
    /** Tipo de cambio */
    exchangeRate?: number;
    
    /** Impuestos de la factura pagada */
    paidInvoiceTaxes?: PaidInvoiceTax[];
  }
  
  /**
   * Impuesto de factura pagada
   */
  export interface PaidInvoiceTax {
    /** Base */
    base?: number;
    
    /** Código de impuesto */
    taxCode?: string;
    
    /** Código de tipo de impuesto */
    taxTypeCode?: string;
    
    /** Tasa de impuesto */
    taxRate?: number;
    
    /** Código de bandera de impuesto */
    taxFlagCode?: string;
  }
  
  /**
   * Respuesta de factura
   */
  export class InvoiceResponse extends BaseDto {
    /** ID de la factura */
    invoiceId?: string;
    
    /** UUID de la factura */
    invoiceUuid?: string;
    
    /** Número de certificado de la factura */
    invoiceCertificateNumber?: string;
    
    /** Sello de la factura en base64 */
    invoiceBase64Sello?: string;
    
    /** Fecha de firma de la factura */
    invoiceSignatureDate?: Date;
    
    /** Código QR de la factura en base64 */
    invoiceBase64QrCode?: string;
    
    /** Factura en base64 */
    invoiceBase64?: string;
    
    /** Sello del SAT en base64 */
    satBase64Sello?: string;
    
    /** Cadena original del SAT en base64 */
    satBase64OriginalString?: string;
    
    /** Número de certificado del SAT */
    satCertificateNumber?: string;
  }
  
  /**
   * Solicitud de cancelación de factura
   */
  export interface CancelInvoiceRequest {
    /** ID de la factura a cancelar */
    id?: string;
    
    /** UUID de la factura a cancelar */
    invoiceUuid?: string;
    
    /** RFC del contribuyente */
    tin?: string;
    
    /** Código de motivo de cancelación */
    cancellationReasonCode?: string;
    
    /** UUID de reemplazo */
    replacementUuid?: string;
    
    /** Credenciales fiscales */
    taxCredentials?: TaxCredential[];
  }
  
  /**
   * Respuesta de cancelación de factura
   */
  export interface CancelInvoiceResponse {
    /** Acuse de cancelación codificado en base64 */
    base64CancellationAcknowledgement?: string;
    
    /** Lista de UUIDs de facturas canceladas o en proceso de cancelación */
    invoiceUuids?: Record<string, string>;
  }
  
  /**
   * Solicitud de creación de PDF
   */
  export interface CreatePdfRequest {
    /** ID de la factura */
    invoiceId?: string;
    
    /** Logo en base64 */
    base64Logo?: string;
    
    /** Color de banda */
    bandColor?: string;
    
    /** Color de fuente */
    fontColor?: string;
  }
  
  /**
   * Solicitud de envío de factura
   */
  export interface SendInvoiceRequest {
    /** ID de la factura */
    invoiceId?: string;
    
    /** Logo en base64 */
    base64Logo?: string;
    
    /** Color de banda */
    bandColor?: string;
    
    /** Color de fuente */
    fontColor?: string;
    
    /** Correo electrónico del destinatario */
    toEmail?: string;
  }
  