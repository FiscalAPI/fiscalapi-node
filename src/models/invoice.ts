import { DateTime } from 'luxon';

// src/models/invoice.ts
import { BaseDto } from '../common/base-dto';

// ============================================================================
// Inline Data Types for Payroll (ByValues)
// ============================================================================

/**
 * Datos del empleador para facturas de nómina (inline en issuer)
 */
export interface InvoiceIssuerEmployerData {
  /** CURP del empleador */
  curp?: string;

  /** Registro patronal del empleador */
  employerRegistration?: string;

  /** RFC del empleador origen (para subcontratación) */
  originEmployerTin?: string;

  /** ID del origen de los recursos (catálogo SAT c_OrigenRecurso) */
  satFundSourceId?: string;

  /** Monto de recursos propios */
  ownResourceAmount?: number;
}

/**
 * Datos del empleado para facturas de nómina (inline en recipient)
 */
export interface InvoiceRecipientEmployeeData {
  /** CURP del empleado */
  curp?: string;

  /** Número de seguridad social del empleado */
  socialSecurityNumber?: string;

  /** Fecha de inicio de la relación laboral */
  laborRelationStartDate?: string;

  /** Antigüedad del empleado en formato ISO 8601 duration (ej: P1Y5M15D) */
  seniority?: string;

  /** ID del tipo de contrato (catálogo SAT c_TipoContrato) */
  satContractTypeId?: string;

  /** ID del estatus de sindicalización (catálogo SAT c_TipoSindicalizado) */
  satUnionizedStatusId?: string;

  /** ID del tipo de jornada laboral (catálogo SAT c_TipoJornada) */
  satWorkdayTypeId?: string;

  /** ID del tipo de régimen fiscal del empleado (catálogo SAT c_TipoRegimen) */
  satTaxRegimeTypeId?: string;

  /** Número de empleado */
  employeeNumber?: string;

  /** Departamento del empleado */
  department?: string;

  /** Puesto del empleado */
  position?: string;

  /** ID del riesgo del puesto (catálogo SAT c_RiesgosPuesto) */
  satJobRiskId?: string;

  /** ID de la periodicidad de pago (catálogo SAT c_PeriodicidadPago) */
  satPaymentPeriodicityId?: string;

  /** ID del banco (catálogo SAT c_Banco) */
  satBankId?: string;

  /** Cuenta bancaria del empleado */
  bankAccount?: string;

  /** Salario base de cotización */
  baseSalaryForContributions?: number;

  /** Salario diario integrado */
  integratedDailySalary?: number;

  /** ID del estado donde se presta el servicio (catálogo SAT c_Estado) */
  satPayrollStateId?: string;
}

// ============================================================================
// Complement Types
// ============================================================================

/**
 * Contenedor principal de complementos de factura
 */
export interface Complement {
  /** Complemento de impuestos locales */
  localTaxes?: LocalTaxesComplement;

  /** Complemento de pago */
  payment?: PaymentComplement;

  /** Complemento de nómina */
  payroll?: PayrollComplement;

  /** Complemento de carta porte */
  lading?: LadingComplement;
}

// ============================================================================
// Local Taxes Complement
// ============================================================================

/**
 * Complemento de impuestos locales
 */
export interface LocalTaxesComplement {
  /** Lista de impuestos locales */
  taxes?: LocalTax[];
}

/**
 * Impuesto local
 */
export interface LocalTax {
  /** Nombre del impuesto local */
  taxName?: string;

  /** Tasa del impuesto local (debe tener 2 posiciones decimales) */
  taxRate?: number | string;

  /** Monto del impuesto local (debe tener 2 posiciones decimales) */
  taxAmount?: number | string;

  /** Código que indica la naturaleza del impuesto. "T": Traslado, "R": Retenido */
  taxFlagCode?: string;
}

// ============================================================================
// Payment Complement
// ============================================================================

/**
 * Complemento de pago
 */
export interface PaymentComplement {
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

  /** Número de operación asignado por el banco */
  operationNumber?: string;

  /** RFC del banco origen. (Rfc del banco emisor del pago) */
  sourceBankTin?: string;

  /** Cuenta bancaria origen. (Cuenta bancaria del banco emisor del pago) */
  sourceBankAccount?: string;

  /** RFC del banco destino. (Rfc del banco receptor del pago) */
  targetBankTin?: string;

  /** Cuenta bancaria destino (Cuenta bancaria del banco receptor del pago) */
  targetBankAccount?: string;

  /** Facturas pagadas con el pago recibido */
  paidInvoices: PaymentPaidInvoice[];
}

/**
 * Factura pagada en el complemento de pago
 */
export interface PaymentPaidInvoice {
  /** UUID de la factura pagada */
  uuid: string;

  /** Serie de la factura pagada */
  series: string;

  /** Folio de la factura pagada */
  number: string;

  /** Monto pagado en la factura */
  paymentAmount: number | string;

  /** Código de la moneda utilizada en la factura pagada. Default: "MXN" */
  currencyCode: string;

  /** Número de parcialidad */
  partialityNumber: number;

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
  paidInvoiceTaxes?: PaymentPaidInvoiceTax[];
}

/**
 * Impuesto de factura pagada en el complemento de pago
 */
export interface PaymentPaidInvoiceTax {
  /** Código del impuesto. Catálogo del SAT c_Impuesto */
  taxCode: string;

  /** Tipo de factor. Catálogo del SAT c_TipoFactor */
  taxTypeCode: string;

  /** Tasa del impuesto. Catálogo del SAT c_TasaOCuota */
  taxRate: number | string;

  /** Código que indica la naturaleza del impuesto. "T": Impuesto Traslado, "R": Impuesto Retenido */
  taxFlagCode: string;
}

// ============================================================================
// Payroll Complement
// ============================================================================

/**
 * Complemento de nómina
 */
export interface PayrollComplement {
  /** Versión del complemento de nómina. Default: "1.2" */
  version?: string;

  /** Código del tipo de nómina. "O": Ordinaria, "E": Extraordinaria */
  payrollTypeCode: string;

  /** Fecha de pago de la nómina */
  paymentDate: string;

  /** Fecha inicial del periodo de pago */
  initialPaymentDate: string;

  /** Fecha final del periodo de pago */
  finalPaymentDate: string;

  /** Número de días pagados */
  daysPaid: number;

  /** Percepciones del empleado */
  earnings?: PayrollEarnings;

  /** Deducciones del empleado */
  deductions?: PayrollDeduction[];

  /** Incapacidades del empleado */
  disabilities?: PayrollDisability[];
}

/**
 * Contenedor de percepciones de nómina
 */
export interface PayrollEarnings {
  /** Lista de percepciones */
  earnings?: PayrollEarning[];

  /** Lista de otros pagos */
  otherPayments?: PayrollOtherPayment[];

  /** Información de jubilación, pensión o retiro */
  retirement?: PayrollRetirement;

  /** Información de separación o indemnización */
  severance?: PayrollSeverance;
}

/**
 * Percepción de nómina
 */
export interface PayrollEarning {
  /** Código del tipo de percepción. Catálogo SAT c_TipoPercepcion */
  earningTypeCode: string;

  /** Clave de control interno de la percepción */
  code: string;

  /** Concepto de la percepción */
  concept: string;

  /** Monto gravado de la percepción */
  taxedAmount: number;

  /** Monto exento de la percepción */
  exemptAmount: number;

  /** Horas extra trabajadas */
  overtime?: PayrollOvertime[];

  /** Opciones de acciones */
  stockOptions?: PayrollStockOptions;
}

/**
 * Opciones de acciones en percepción
 */
export interface PayrollStockOptions {
  /** Precio de mercado de la acción */
  marketPrice: number;

  /** Precio de ejercicio de la acción */
  grantPrice: number;
}

/**
 * Horas extra en percepción
 */
export interface PayrollOvertime {
  /** Número de días con horas extra */
  days: number;

  /** Código del tipo de horas. "01": Dobles, "02": Triples */
  hoursTypeCode: string;

  /** Número de horas extra trabajadas */
  extraHours: number;

  /** Monto pagado por las horas extra */
  amountPaid: number;
}

/**
 * Otros pagos de nómina
 */
export interface PayrollOtherPayment {
  /** Código del tipo de otro pago. Catálogo SAT c_TipoOtroPago */
  otherPaymentTypeCode: string;

  /** Clave de control interno del otro pago */
  code: string;

  /** Concepto del otro pago */
  concept: string;

  /** Monto del otro pago */
  amount: number;

  /** Subsidio causado (para tipo 002) */
  subsidyCaused?: number;

  /** Compensación de saldos a favor */
  balanceCompensation?: PayrollBalanceCompensation;
}

/**
 * Compensación de saldos a favor en otros pagos
 */
export interface PayrollBalanceCompensation {
  /** Saldo a favor */
  favorableBalance: number;

  /** Año del saldo a favor */
  year: number;

  /** Saldo a favor remanente */
  remainingFavorableBalance: number;
}

/**
 * Información de jubilación, pensión o retiro
 */
export interface PayrollRetirement {
  /** Total de pago único */
  totalOneTime?: number;

  /** Total de parcialidades */
  totalInstallments?: number;

  /** Monto diario */
  dailyAmount?: number;

  /** Ingreso acumulable */
  accumulableIncome?: number;

  /** Ingreso no acumulable */
  nonAccumulableIncome?: number;
}

/**
 * Información de separación o indemnización
 */
export interface PayrollSeverance {
  /** Total pagado */
  totalPaid: number;

  /** Años de servicio */
  yearsOfService: number;

  /** Último sueldo mensual ordinario */
  lastMonthlySalary: number;

  /** Ingreso acumulable */
  accumulableIncome: number;

  /** Ingreso no acumulable */
  nonAccumulableIncome: number;
}

/**
 * Deducción de nómina
 */
export interface PayrollDeduction {
  /** Código del tipo de deducción. Catálogo SAT c_TipoDeduccion */
  deductionTypeCode: string;

  /** Clave de control interno de la deducción */
  code: string;

  /** Concepto de la deducción */
  concept: string;

  /** Monto de la deducción */
  amount: number;
}

/**
 * Incapacidad de nómina
 */
export interface PayrollDisability {
  /** Número de días de incapacidad */
  disabilityDays: number;

  /** Código del tipo de incapacidad. Catálogo SAT c_TipoIncapacidad */
  disabilityTypeCode: string;

  /** Monto monetario de la incapacidad */
  monetaryAmount?: number;
}

// ============================================================================
// Lading Complement (Carta Porte)
// ============================================================================

/**
 * Complemento de carta porte (placeholder para futura implementación)
 */
export interface LadingComplement {
  // Carta Porte complement - to be implemented
}

/**
 * Modelo factura
 * Contiene toda la información de una factura, como datos del emisor, receptor, 
 * productos/servicios, importes, método de pago, el tipo de factura, entre otros.
 */
export interface Invoice extends BaseDto {
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

  /**
   * Pago o pagos recibidos para liquidar parcial o totalmente una factura de ingreso emitida previamente
   * @deprecated Use complement.payment instead
   */
  payments?: InvoicePayment[];

  /** Complementos de la factura (nómina, pago, impuestos locales, carta porte) */
  complement?: Complement;

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

  /** Datos del empleador para facturas de nómina (inline, modo ByValues) */
  employerData?: InvoiceIssuerEmployerData;

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

  /** Datos del empleado para facturas de nómina (inline, modo ByValues) */
  employeeData?: InvoiceRecipientEmployeeData;
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