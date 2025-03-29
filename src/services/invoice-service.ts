import { 
  Invoice, 
  CancelInvoiceRequest, 
  CancelInvoiceResponse, 
  CreatePdfRequest, 
  SendInvoiceRequest 
} from '../models/invoice';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IInvoiceService } from '../abstractions/invoice-service.interface';

/**
 * Implementación del servicio de facturas
 */
export class InvoiceService extends BaseFiscalapiService<Invoice> implements IInvoiceService {
  /**
   * Crea una nueva instancia del servicio de facturas
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'invoices', apiVersion);
  }

  /**
   * @inheritdoc
   */
  async createPdf(request: CreatePdfRequest): Promise<ApiResponse<FileResponse>> {
    return this.executeOperation<FileResponse, CreatePdfRequest>('pdf', request);
  }

  /**
   * @inheritdoc
   */
  async sendInvoice(request: SendInvoiceRequest): Promise<ApiResponse<boolean>> {
    return this.executeOperation<boolean, SendInvoiceRequest>('send', request);
  }

  /**
   * @inheritdoc
   */
  async cancelInvoice(request: CancelInvoiceRequest): Promise<ApiResponse<CancelInvoiceResponse>> {
    return this.executeOperation<CancelInvoiceResponse, CancelInvoiceRequest>('cancel', request);
  }
}