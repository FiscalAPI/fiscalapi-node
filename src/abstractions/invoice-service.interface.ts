import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';
import { 
  Invoice, 
  CancelInvoiceRequest, 
  CancelInvoiceResponse, 
  CreatePdfRequest, 
  SendInvoiceRequest,
  InvoiceStatusRequest,
  InvoiceStatusResponse
} from '../models/invoice';
import { IFiscalapiService } from './fiscalapi-service.interface';

/**
 * Interfaz para el servicio de facturas
 */
export interface IInvoiceService extends IFiscalapiService<Invoice> {
  /**
   * POST /api/v4/invoices
   * Crea una factura. Con `idempotencyKey` (hasta 64 caracteres) se envía el header `Idempotency-Key`: repetir la key
   * con la misma petición responde la factura original sin timbrar otra vez; con otra petición, 422. Sin ella, el
   * header no se envía.
   * @param {Invoice} model - Datos de la factura
   * @param {string} [idempotencyKey] - Valor del header Idempotency-Key
   * @returns {Promise<ApiResponse<Invoice>>} Factura creada
   */
  create(model: Invoice, idempotencyKey?: string): Promise<ApiResponse<Invoice>>;

  /**
   * Cancela una factura
   * @param {CancelInvoiceRequest} request - Solicitud para cancelar factura
   * @returns {Promise<ApiResponse<CancelInvoiceResponse>>} Respuesta de la cancelación
   */
  cancel(request: CancelInvoiceRequest): Promise<ApiResponse<CancelInvoiceResponse>>;
  
  /**
   * Obtiene el PDF de una factura
   * @param {CreatePdfRequest} request - Solicitud para crear PDF
   * @returns {Promise<ApiResponse<FileResponse>>} Respuesta con el archivo PDF
   */
  getPdf(request: CreatePdfRequest): Promise<ApiResponse<FileResponse>>;
  
  /**
   * Obtiene el XML de una factura
   * @param {string} id - ID de la factura
   * @returns {Promise<ApiResponse<FileResponse>>} Respuesta con el archivo XML
   */
  getXml(id: string): Promise<ApiResponse<FileResponse>>;
  
  /**
   * Envía una factura por correo electrónico
   * @param {SendInvoiceRequest} request - Solicitud para enviar factura
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  send(request: SendInvoiceRequest): Promise<ApiResponse<boolean>>;
  
  /**
   * Obtiene el estado de una factura
   * @param {InvoiceStatusRequest} request - Solicitud para consultar estado
   * @returns {Promise<ApiResponse<InvoiceStatusResponse>>} Respuesta con el estado de la factura
   */
  getStatus(request: InvoiceStatusRequest): Promise<ApiResponse<InvoiceStatusResponse>>;
}