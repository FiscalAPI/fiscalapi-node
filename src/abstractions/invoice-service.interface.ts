 
import { IFiscalapiService } from './fiscalapi-service.interface';
import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';
import { 
  Invoice, 
  CancelInvoiceRequest, 
  CancelInvoiceResponse, 
  CreatePdfRequest, 
  SendInvoiceRequest 
} from '../models/invoice';

/**
 * Interfaz del servicio de facturas
 */
export interface IInvoiceService extends IFiscalapiService<Invoice> {
  /**
   * Crea un PDF para una factura
   * @param {CreatePdfRequest} request - Solicitud de creación de PDF
   * @returns {Promise<ApiResponse<FileResponse>>} Respuesta con el archivo PDF
   */
  createPdf(request: CreatePdfRequest): Promise<ApiResponse<FileResponse>>;
  
  /**
   * Envía una factura por correo electrónico
   * @param {SendInvoiceRequest} request - Solicitud de envío de factura
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  sendInvoice(request: SendInvoiceRequest): Promise<ApiResponse<boolean>>;
  
  /**
   * Cancela una factura
   * @param {CancelInvoiceRequest} request - Solicitud de cancelación
   * @returns {Promise<ApiResponse<CancelInvoiceResponse>>} Respuesta de cancelación
   */
  cancelInvoice(request: CancelInvoiceRequest): Promise<ApiResponse<CancelInvoiceResponse>>;
}

