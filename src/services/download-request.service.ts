import { DownloadRequest, Xml, MetadataItem } from '../models/download';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IDownloadRequestService } from '../abstractions/download-request.service.interface';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { FileResponse } from '../common/file-response';

/**
 * Implementación del servicio de solicitudes de descarga masiva
 */
export class DownloadRequestService extends BaseFiscalapiService<DownloadRequest> implements IDownloadRequestService {
  /**
   * Crea una nueva instancia del servicio de solicitudes de descarga masiva
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'download-requests', apiVersion);
  }

  /**
   * Lista los xmls descargados para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Lista paginada de objetos Xml
   */
  getXmlsAsync(requestId: string): Promise<ApiResponse<PagedList<Xml>>> {
    // GET /api/v4/download-requests/<requestId>/xmls
    const path = `${requestId}/xmls`;
    const endpoint = this.buildEndpoint(path);
    return this.httpClient.getAsync<PagedList<Xml>>(endpoint);
  }

  /**
   * Lista los meta-items descargados para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Lista paginada de objetos MetadataItem
   */
  getMetadataItemsAsync(requestId: string): Promise<ApiResponse<PagedList<MetadataItem>>> {
    // GET /api/v4/download-requests/<requestId>/meta-items
    const path = `${requestId}/meta-items`;
    const endpoint = this.buildEndpoint(path);
    return this.httpClient.getAsync<PagedList<MetadataItem>>(endpoint);
  }

  /**
   * Downloads la lista de paquetes (archivos .zip) de un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Lista de FileResponses
   */
  downloadPackageAsync(requestId: string): Promise<ApiResponse<FileResponse[]>> {
    // GET /api/v4/download-requests/<requestId>/package
    const path = `${requestId}/package`;
    const endpoint = this.buildEndpoint(path);
    return this.httpClient.getAsync<FileResponse[]>(endpoint);
  }

  /**
   * Descarga el archivo crudo de solicitud SAT para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Objeto de respuesta de archivo
   */
  downloadSatRequestAsync(requestId: string): Promise<ApiResponse<FileResponse>> {
    // GET /api/v4/download-requests/<requestId>/raw-request
    const path = `${requestId}/raw-request`;
    const endpoint = this.buildEndpoint(path);
    return this.httpClient.getAsync<FileResponse>(endpoint);
  }

  /**
   * Descarga la respuesta SAT para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Objeto de respuesta de archivo
   */
  downloadSatResponseAsync(requestId: string): Promise<ApiResponse<FileResponse>> {
    // GET /api/v4/download-requests/<requestId>/raw-response
    const path = `${requestId}/raw-response`;
    const endpoint = this.buildEndpoint(path);
    return this.httpClient.getAsync<FileResponse>(endpoint);
  }

  /**
   * Busca solicitudes de descarga creadas en una fecha específica.
   * 
   * @param createdAt - Fecha de creación
   * @returns Lista de solicitudes de descarga
   */
  searchAsync(createdAt: Date): Promise<ApiResponse<DownloadRequest[]>> {
    // GET /api/v4/download-requests/search?createdAt=2025-08-21
    const formattedDate = createdAt.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const path = `search?createdAt=${formattedDate}`;
    const endpoint = this.buildEndpoint(path);
    return this.httpClient.getAsync<DownloadRequest[]>(endpoint);
  }
}