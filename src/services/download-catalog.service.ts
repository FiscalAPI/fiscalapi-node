
import { CatalogDto } from '../common/catalog-dto';
import { ApiResponse } from '../common/api-response';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { IDownloadCatalogService } from '../abstractions/download-catalog.inteface';


/**
 * Implementación del servicio de catálogos de descarga masiva
 */
export class DownloadCatalogService implements IDownloadCatalogService {
  private readonly httpClient: IFiscalapiHttpClient;
  private readonly baseEndpoint: string;
  private readonly apiVersion: string;

  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string = 'v4') {
    this.httpClient = httpClient;
    this.apiVersion = apiVersion;
    this.baseEndpoint = `api/${apiVersion}/download-catalogs`;
  }
   

  /**
   * Construye el endpoint completo para las peticiones
   * @param path - Ruta adicional opcional
   * @returns URL completa del endpoint
   */
  private buildEndpoint(path?: string): string {
    return path ? `${this.baseEndpoint}/${path}` : this.baseEndpoint;
  }

  /**
   * GET /api/v4/download-catalogs
   * Recupera todos los nombres de los catálogos de descarga masiva disponibles
   */
  async getList(): Promise<ApiResponse<string[]>> {
    const endpoint = this.buildEndpoint();
    return this.httpClient.getAsync<string[]>(endpoint);
  }

  /**
   * GET /api/v4/download-catalogs/{catalogName}
   * Lista todos los registros de un catálogo específico
   */
  async listCatalog(catalogName: string): Promise<ApiResponse<CatalogDto[]>> {
    const endpoint = this.buildEndpoint(catalogName);
    return this.httpClient.getAsync<CatalogDto[]>(endpoint);
  }

}

