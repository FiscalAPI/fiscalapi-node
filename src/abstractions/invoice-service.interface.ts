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