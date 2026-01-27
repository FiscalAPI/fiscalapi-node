import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { ApiResponse } from '../common/api-response';
import { FileResponse } from '../common/file-response';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IInvoiceService } from '../abstractions/invoice-service.interface';
import { 
  Invoice, 
  CancelInvoiceRequest, 
  CancelInvoiceResponse, 
  CreatePdfRequest, 
  SendInvoiceRequest,
  InvoiceStatusRequest,
  InvoiceStatusResponse
} from '../models/invoice';

/**
 * Implementación del servicio de facturas
 */
export class InvoiceService extends BaseFiscalapiService<Invoice> implements IInvoiceService {
  private readonly INCOME_ENDPOINT = 'income';
  private readonly CREDIT_NOTE_ENDPOINT = 'credit-note';
  private readonly PAYMENT_ENDPOINT = 'payment';

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
   override async create(requestModel: Invoice): Promise<ApiResponse<Invoice>> {
    if (!requestModel) {
      throw new Error('requestModel cannot be null');
    }

    let endpoint: string;

    switch (requestModel.typeCode) {
      case 'I':
        endpoint = this.INCOME_ENDPOINT;
        break;
      case 'E':
        endpoint = this.CREDIT_NOTE_ENDPOINT;
        break;
      case 'P':
        endpoint = this.PAYMENT_ENDPOINT;
        break;
      default:
        throw new Error(`Unsupported invoice type: ${requestModel.typeCode}`);
    }

    return await this.executeRequest<Invoice, Invoice>({
      path: endpoint,
      data: requestModel,
      method: 'POST',
    });
  }

  /**
   * Cancela una factura
   * @param {CancelInvoiceRequest} request - Solicitud para cancelar factura
   * @returns {Promise<ApiResponse<CancelInvoiceResponse>>} Respuesta de la cancelación
   */
  async cancel(request: CancelInvoiceRequest): Promise<ApiResponse<CancelInvoiceResponse>> {
    if (!request) {
      throw new Error('request cannot be null');
    }

    return await this.executeRequest<CancelInvoiceResponse, CancelInvoiceRequest>({
      data: request,
      method: 'DELETE',
    });
  }

  /**
   * Obtiene el PDF de una factura
   * @param {CreatePdfRequest} request - Solicitud para crear PDF
   * @returns {Promise<ApiResponse<FileResponse>>} Respuesta con el archivo PDF
   */
  async getPdf(request: CreatePdfRequest): Promise<ApiResponse<FileResponse>> {
    if (!request) {
      throw new Error('request cannot be null');
    }
    return await this.executeRequest<FileResponse, CreatePdfRequest>({
      path: 'pdf',
      data: request,
      method: 'POST',
    });
  }

  /**
   * Obtiene el XML de una factura
   * @param {string} id - ID de la factura
   * @returns {Promise<ApiResponse<FileResponse>>} Respuesta con el archivo XML
   */
  async getXml(id: string): Promise<ApiResponse<FileResponse>> {

    if (!id || id.trim() === '') {
      throw new Error('id cannot be null or empty');
    }

    return await this.executeRequest<FileResponse, string>({
      path:`${id}/xml`,
      method: 'GET',
    });

  }

  /**
   * Envía una factura por correo electrónico
   * @param {SendInvoiceRequest} request - Solicitud para enviar factura
   * @returns {Promise<ApiResponse<boolean>>} Resultado de la operación
   */
  async send(request: SendInvoiceRequest): Promise<ApiResponse<boolean>> {
    return await this.executeRequest<boolean, SendInvoiceRequest>({
      path: 'send',
      data: request,
      method: 'POST',
    });
  }

  /**
   * Obtiene el estado de una factura
   * @param {InvoiceStatusRequest} request - Solicitud para consultar estado
   * @returns {Promise<ApiResponse<InvoiceStatusResponse>>} Respuesta con el estado de la factura
   */
  async getStatus(request: InvoiceStatusRequest): Promise<ApiResponse<InvoiceStatusResponse>> {
    return await this.executeRequest<InvoiceStatusResponse, InvoiceStatusRequest>({
      path: 'status',
      data: request,
      method: 'POST',
    });
  }
}