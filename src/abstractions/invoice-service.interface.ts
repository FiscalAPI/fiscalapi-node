import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';
import { 
  Invoice, 
  CancelInvoiceRequest, 
  CancelInvoiceResponse, 
  CreatePdfRequest, 
  SendInvoiceRequest 
} from '../models/invoice';
import { IFiscalapiService } from './fiscalapi-service.interface';

/**
 * Interfaz para el servicio de facturas
 */
export interface IInvoiceService extends IFiscalapiService<Invoice> {
  /**
   * Crea un PDF de una factura
   * @param {CreatePdfRequest} request - Solicitud para crear PDF
   * @returns {Promise<ApiResponse<FileResponse>>} Respuesta con el archivo PDF
   */
  createPdf(request: CreatePdfRequest): Promise<ApiResponse<FileResponse>>;
  
  /**
   * Envía una factura por correo electrónico
   * @param {SendInvoiceRequest} request - Solicitud para enviar factura
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  sendInvoice(request: SendInvoiceRequest): Promise<ApiResponse<boolean>>;
  
  /**
   * Cancela una factura
   * @param {CancelInvoiceRequest} request - Solicitud para cancelar factura
   * @returns {Promise<ApiResponse<CancelInvoiceResponse>>} Respuesta de la cancelación
   */
  cancelInvoice(request: CancelInvoiceRequest): Promise<ApiResponse<CancelInvoiceResponse>>;
}