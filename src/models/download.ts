import { DateTime } from 'luxon';
import { BaseDto } from '../common/base-dto';
import { CatalogDto } from '../common/catalog-dto';
import { Person } from './person';

/**
 * Representa una plantilla para crear solicitudes de descarga de CFDI o metadatos.
 */
export interface DownloadRule extends BaseDto {
  /** ID de la persona asociada a la regla de descarga */
  personId?: string;
  
  /** Información de la persona asociada */
  person?: Person;
  
  /** RFC (Tax Identification Number) del solicitante */
  tin?: string;
  
  /** Descripción de la regla de descarga */
  description?: string;

  /** 
   * Estado de la regla de descarga
   * 1: Pendiente, 2: Aprobada, 3: Rechazada, 4: Abandonada
   */
  downloadRuleStatusId?: string;
  
  /** Catálogo del estado de la regla de descarga */
  downloadRuleStatus?: CatalogDto;

  /**
   * Tipo de consulta SAT
   * CFDI, Metadata
   */
  satQueryTypeId?: string;
  
  /** Catálogo del tipo de consulta SAT */
  satQueryType?: CatalogDto;

  /**
   * Tipo de descarga
   * Emitidos, Recibidos
   */
  downloadTypeId?: string;
  
  /** Catálogo del tipo de descarga */
  downloadType?: CatalogDto;

  /**
   * Estado de la factura SAT
   * Vigente, Cancelado
   */
  satInvoiceStatusId?: string;
  
  /** Catálogo del estado de la factura SAT */
  satInvoiceStatus?: CatalogDto;
}

/**
 * Representa una solicitud de descarga de CFDI o metadatos
 */
export interface DownloadRequest extends BaseDto {
    /** Número consecutivo de la solicitud */
    consecutive?: number;
  
    /** 
     * ID de solicitud SAT utilizado para rastrear la solicitud en el sistema SAT
     */
    satRequestId?: string;
  
    /** 
     * ID de la regla asociada con la solicitud
     */
    downloadRuleId?: string;
  
    /** ID del tipo de descarga */
    downloadTypeId?: string;
    
    /** Catálogo del tipo de descarga */
    downloadType?: CatalogDto;
  
    /** ID del tipo de solicitud de descarga */
    downloadRequestTypeId?: string;
    
    /** Catálogo del tipo de solicitud de descarga */
    downloadRequestType?: CatalogDto;
  
    /** 
     * RFC Receptor
     * CFDI específicos o metadatos del RFC receptor dado
     */
    recipientTin?: string;
  
    /** 
     * RFC Emisor
     * CFDI específicos o metadatos del RFC emisor dado
     */
    issuerTin?: string;
  
    /** 
     * RFC Solicitante
     * RFC quien está solicitando la consulta
     */
    requesterTin?: string;
  
    /** 
     * Fecha inicial
     * Fecha de inicio para la solicitud asociada
     */
    startDate: DateTime;
  
    /** 
     * Fecha final
     * Fecha de fin para la solicitud asociada
     */
    endDate: DateTime;
  
    /** 
     * Tipo de solicitud
     * Tipo de solicitud para la petición
     * CFDI o Metadata
     */
    satQueryTypeId?: string;
    
    /** Catálogo del tipo de consulta SAT */
    satQueryType?: CatalogDto;
  
    /** 
     * Tipo de comprobante
     * Tipo específico de factura a solicitar
     * Ingreso, Egreso, Traslado, Nómina, Pago, Todos
     */
    satInvoiceTypeId?: string;
    
    /** Catálogo del tipo de factura SAT */
    satInvoiceType?: CatalogDto;
  
    /** 
     * Estado del comprobante
     * Estado de los CFDI a solicitar
     */
    satInvoiceStatusId?: string;
    
    /** Catálogo del estado de la factura SAT */
    satInvoiceStatus?: CatalogDto;
  
    /** 
     * Complemento
     * Complementos CFDI para la solicitud
     */
    satInvoiceComplementId?: string;
    
    /** Catálogo del complemento de factura SAT */
    satInvoiceComplement?: CatalogDto;
  
    /** 
     * Estado actual de la solicitud
     * DESCONOCIDO, ACEPTADA, EN PROCESO, TERMINADA, ERROR, RECHAZADA, VENCIDA
     */
    satRequestStatusId?: string;
    
    /** Catálogo del estado de la solicitud SAT */
    satRequestStatus?: CatalogDto;
  
    /** 
     * ID del estado de la solicitud en Fiscalapi
     */
    downloadRequestStatusId?: string;
    
    /** Catálogo del estado de la solicitud de descarga */
    downloadRequestStatus?: CatalogDto;
  
    /** 
     * Fecha del último intento
     * Fecha del último intento para la solicitud asociada
     */
    lastAttemptDate?: DateTime | string;
  
    /** 
     * Fecha del siguiente intento
     * Fecha del siguiente intento para la solicitud asociada
     */
    nextAttemptDate?: DateTime | string;
  
    /** 
     * Número de CFDI encontrados para la solicitud cuando la solicitud está terminada
     */
    invoiceCount?: number;
  
    /** 
     * Lista de IDs de paquetes disponibles para descarga cuando la solicitud está terminada
     */
    packageIds?: string[];
  
    /** 
     * Indica si la solicitud está lista para descarga, se vuelve verdadero cuando la solicitud está terminada y los paquetes están disponibles
     */
    isReadyToDownload?: boolean;
  
    /** 
     * Número total de reintentos intentados para esta solicitud a través de todas las re-submisiones
     */
    retriesCount?: number;
  }

  /**
 * Representa un elemento de metadatos de CFDI descargado desde el SAT
 */
export interface MetadataItem extends BaseDto {
    /** 
     * Folio de la factura - UUID
     */
    invoiceUuid?: string;
  
    /** 
     * RFC del emisor del comprobante - RfcEmisor
     */
    issuerTin?: string;
  
    /** 
     * Nombre o razón social del emisor - NombreEmisor
     */
    issuerName?: string;
  
    /** 
     * RFC del receptor del comprobante - RfcReceptor
     */
    recipientTin?: string;
  
    /** 
     * Nombre o razón social del receptor - NombreReceptor
     */
    recipientName?: string;
  
    /** 
     * RFC del Proveedor Autorizado de Certificación (PAC) - RfcPac
     */
    pacTin?: string;
  
    /** 
     * Fecha y hora de emisión del comprobante - FechaEmision
     */
    invoiceDate: DateTime | string;
  
    /** 
     * Fecha y hora de certificación por el SAT - FechaCertificacionSat
     */
    satCertificationDate: DateTime | string;
  
    /** 
     * Monto total del comprobante - Monto
     */
    amount?: number;
  
    /** 
     * Tipo de comprobante (I = Ingreso, E = Egreso, T = Traslado, N = Nómina, P = Pago) - EfectoComprobante
     */
    invoiceType?: string;
  
    /** 
     * Estatus del comprobante (1 = Vigente, 0 = Cancelado) - Estatus
     */
    status?: number;
  
    /** 
     * Fecha de cancelación del comprobante (si aplica) - FechaCancelacion
     */
    cancellationDate?: DateTime | string;
  
    /** ID del paquete de descarga */
    downloadPackageId?: string;
    
    /** ID de la solicitud de descarga */
    downloadRequestId?: string;
  }

  /**
 * Representa el XML de un CFDI (Comprobante Fiscal Digital por Internet) descargado desde el SAT
 */
export interface Xml extends BaseDto {
    /** ID de la solicitud de descarga */
    downloadRequestId?: string;
  
    /** Versión del CFDI */
    version?: string;
  
    /** Serie */
    series?: string;
  
    /** Folio */
    number?: string;
  
    /** Fecha de emisión del CFDI */
    date: DateTime | string;
  
    /** Código de la forma de pago */
    paymentForm?: string;
  
    /** Código del método de pago */
    paymentMethod?: string;
  
    /** Número de certificado del emisor */
    certificateNumber?: string;
  
    /** Condiciones de pago */
    paymentConditions?: string;
  
    /** Subtotal del CFDI */
    subTotal?: number;
  
    /** Descuento aplicado al CFDI */
    discount?: number;
  
    /** Código de la moneda del CFDI */
    currency?: string;
  
    /** Tipo de cambio del CFDI (si aplica) */
    exchangeRate?: number;
  
    /** Total del CFDI */
    total?: number;
  
    /** Tipo de comprobante (I = Ingreso, E = Egreso, T = Traslado, N = Nómina, P = Pago) */
    invoiceType?: string;
  
    /** Código de exportación (si aplica) */
    export?: string;
  
    /** Lugar de expedición del CFDI */
    expeditionZipCode?: string;
  
    /** Confirmación si aplica */
    confirmation?: string;
  
    /** Total impuestos retenidos */
    totalWithheldTaxes?: number;
  
    /** Total impuestos trasladados */
    totalTransferredTaxes?: number;
  
    /** Información global del CFDI (para CFDI globales) */
    xmlGlobalInformation?: XmlGlobalInformation;
  
    /** Información de impuestos del CFDI */
    taxes?: XmlTax[];
  
    /** Información sobre facturas relacionadas del CFDI (CFDI relacionados) */
    xmlRelated?: XmlRelated[];
  
    /** Información del emisor del CFDI */
    xmlIssuer?: XmlIssuer;
  
    /** Información del receptor del CFDI */
    xmlRecipient?: XmlRecipient;
  
    /** Información de los conceptos del CFDI */
    xmlItems?: XmlItem[];
  
    /** Información de los complementos del CFDI */
    xmlComplements?: XmlComplement[];
  
    /** XML crudo en base64 */
    base64Content?: string;
  }
  
  /**
   * Información global del CFDI
   */
  export interface XmlGlobalInformation extends BaseDto {
    /** Periodicidad */
    periodicity?: string;
  
    /** Mes */
    month?: string;
  
    /** Año */
    year?: number;
  }
  
  /**
   * Información del emisor del CFDI
   */
  export interface XmlIssuer extends BaseDto {
    /** RFC del emisor */
    tin?: string;
  
    /** Razón social */
    legalName?: string;
  
    /** Régimen fiscal */
    taxRegime?: string;
  }
  
  /**
   * Información aduanera del concepto
   */
  export interface XmlItemCustomsInformation extends BaseDto {
    /** ID del concepto XML */
    xmlItemId?: string;
  
    /** Número de documento aduanero */
    customsDocumentNumber?: string;
  }
  
  /**
   * Concepto del CFDI
   */
  export interface XmlItem extends BaseDto {
    /** ID del XML */
    xmlId?: string;
  
    /** Código del concepto */
    itemCode?: string;
  
    /** SKU del concepto */
    sku?: string;
  
    /** Cantidad */
    quantity?: number;
  
    /** Unidad de medida */
    unitMeasurement?: string;
  
    /** Descripción */
    description?: string;
  
    /** Precio unitario */
    unitPrice?: number;
  
    /** Importe */
    amount?: number;
  
    /** Descuento */
    discount?: number;
  
    /** Objeto de impuesto */
    taxObject?: string;
  
    /** Cuenta de terceros */
    thirdPartyAccount?: string;
  
    /** Información aduanera del concepto */
    xmlItemCustomsInformation?: XmlItemCustomsInformation[];
  
    /** Cuentas prediales del concepto */
    xmlItemPropertyAccounts?: XmlItemPropertyAccount[];
  
    /** Impuestos del concepto */
    taxes?: XmlItemTax[];
  }
  
  /**
   * Cuenta predial del concepto
   */
  export interface XmlItemPropertyAccount extends BaseDto {
    /** ID del concepto XML */
    xmlItemId?: string;
  
    /** Número de cuenta predial */
    propertyAccountNumber?: string;
  }
  
  /**
   * Impuesto del concepto
   */
  export interface XmlItemTax extends BaseDto {
    /** Base del impuesto */
    base?: number;
  
    /** Código del impuesto */
    tax?: string;
  
    /** Tipo de impuesto */
    taxType?: string;
  
    /** Tasa o cuota */
    rate?: number;
  
    /** Importe del impuesto */
    amount?: number;
  
    /** Naturaleza del impuesto (T = Traslado, R = Retención) */
    taxFlag?: string;
  
    /** ID del concepto XML */
    xmlItemId?: string;
  }
  
  /**
   * Información del receptor del CFDI
   */
  export interface XmlRecipient extends BaseDto {
    /** RFC del receptor */
    tin?: string;
  
    /** Razón social */
    legalName?: string;
  
    /** Código postal */
    zipCode?: string;
  
    /** Régimen fiscal */
    taxRegime?: string;
  
    /** Uso del CFDI */
    cfdiUse?: string;
  
    /** ID fiscal extranjero */
    foreignTaxId?: string;
  
    /** Residencia fiscal */
    fiscalResidence?: string;
  }
  
  /**
   * CFDI relacionado
   */
  export interface XmlRelated extends BaseDto {
    /** ID del XML */
    xmlId?: string;
  
    /** Tipo de relación */
    relationshipType?: string;
  
    /** UUID del CFDI relacionado */
    cfdiUuid?: string;
  }
  
  /**
   * Impuesto del CFDI
   */
  export interface XmlTax extends BaseDto {
    /** Base del impuesto */
    base?: number;
  
    /** Código del impuesto */
    tax?: string;
  
    /** Tipo de impuesto */
    taxType?: string;
  
    /** Tasa o cuota */
    rate?: number;
  
    /** Importe del impuesto */
    amount?: number;
  
    /** Naturaleza del impuesto (T = Traslado, R = Retención) */
    taxFlag?: string;
  
    /** ID del XML */
    xmlId?: string;
  }
  
  /**
   * Complemento del CFDI
   */
  export interface XmlComplement extends BaseDto {
    /** Nombre del complemento */
    complementName?: string;
  
    /** Valor del complemento en base64 */
    base64ComplementValue?: string;
  
    /** ID del XML */
    xmlId?: string;
  }