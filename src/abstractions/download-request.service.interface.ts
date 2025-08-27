import { IFiscalapiService } from './fiscalapi-service.interface';
import { DownloadRequest, Xml, MetadataItem } from '../models/download';
import { ApiResponse } from '../common/api-response';
import { PagedList } from '../common/paged-list';
import { FileResponse } from '../common/file-response';

/**
 * Interfaz del servicio de solicitudes de descarga masiva
 */
export interface IDownloadRequestService extends IFiscalapiService<DownloadRequest> {
  /**
   * Lista los xmls descargados para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Lista paginada de objetos Xml
   */
  getXmlsAsync(requestId: string): Promise<ApiResponse<PagedList<Xml>>>;

  /**
   * Lista los meta-items descargados para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Lista paginada de objetos MetadataItem
   */
  getMetadataItemsAsync(requestId: string): Promise<ApiResponse<PagedList<MetadataItem>>>;

  /**
   * Downloads la lista de paquetes (archivos .zip) de un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Lista de FileResponses
   */
  downloadPackageAsync(requestId: string): Promise<ApiResponse<FileResponse[]>>;

  /**
   * Descarga el archivo crudo de solicitud SAT para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Objeto de respuesta de archivo
   */
  downloadSatRequestAsync(requestId: string): Promise<ApiResponse<FileResponse>>;

  /**
   * Descarga la respuesta SAT para un requestId.
   * 
   * @param requestId - ID de la solicitud
   * @returns Objeto de respuesta de archivo
   */
  downloadSatResponseAsync(requestId: string): Promise<ApiResponse<FileResponse>>;

  /**
   * Busca solicitudes de descarga creadas en una fecha específica.
   * 
   * @param createdAt - Fecha de creación
   * @returns Lista de solicitudes de descarga
   */
  searchAsync(createdAt: Date): Promise<ApiResponse<DownloadRequest[]>>;
}