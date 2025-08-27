

import { IFiscalapiClient } from '../abstractions/fiscalapi-client.interface';
import { IInvoiceService } from '../abstractions/invoice-service.interface';
import { IProductService } from '../abstractions/product-service.interface';
import { IPersonService } from '../abstractions/person-service.interface';
import { IApiKeyService } from '../abstractions/api-key-service.interface';
import { ICatalogService } from '../abstractions/catalog-service.interface';
import { ITaxFileService } from '../abstractions/tax-file-service.interface';
import { IDownloadCatalogService } from '../abstractions/download-catalog.inteface';
import { FiscalapiSettings } from '../common/fiscalapi-settings';
import { FiscalapiHttpClientFactory } from '../http/fiscalapi-http-client-factory';
import { ApiKeyService } from './api-key-service';
import { CatalogService } from './catalog-service';
import { DownloadCatalogService } from './download-catalog.service';
import { InvoiceService } from './invoice-service';
import { PersonService } from './person-service';
import { ProductService } from './product-service';
import { TaxFileService } from './tax-file-service';
import { DownloadRuleService } from './download-rule.service';
import { IDownloadRuleService } from '../abstractions/download-rule.service.inteface';
import { DownloadRequestService } from './download-request.service';
import { IDownloadRequestService } from '../abstractions/download-request.service.interface';

/**
 * Cliente principal para FiscalAPI
 */
export class FiscalapiClient implements IFiscalapiClient {
  /**
   * Servicio de facturas
   */
  readonly invoices: IInvoiceService;
  
  /**
   * Servicio de productos
   */
  readonly products: IProductService;
  
  /**
   * Servicio de personas
   */
  readonly persons: IPersonService;
  
  /**
   * Servicio de claves de API
   */
  readonly apiKeys: IApiKeyService;
  
  /**
   * Servicio de catálogos
   */
  readonly catalogs: ICatalogService;
  
  /**
   * Servicio de archivos fiscales
   */
  readonly taxFiles: ITaxFileService;

  /**
   * Servicio de catálogos de descarga masiva
   */
  readonly downloadCatalogs: IDownloadCatalogService;

  /**
   * Servicio de reglas de descarga masiva
   */
  readonly downloadRules: IDownloadRuleService;

  /**
   * Servicio de solicitudes de descarga masiva
   */
  readonly downloadRequests: IDownloadRequestService;

  /**
   * Crea una nueva instancia del cliente de FiscalAPI
   * @param {FiscalapiSettings} settings - Configuración
   * @private
   */
  private constructor(settings: FiscalapiSettings) {
    // Crea el cliente HTTP
    const httpClient = FiscalapiHttpClientFactory.create(settings);
    const apiVersion = settings.apiVersion || 'v4';
    
    // Inicializa los servicios
    this.invoices = new InvoiceService(httpClient, apiVersion);
    this.products = new ProductService(httpClient, apiVersion);
    this.persons = new PersonService(httpClient, apiVersion);
    this.apiKeys = new ApiKeyService(httpClient, apiVersion);
    this.catalogs = new CatalogService(httpClient, apiVersion);
    this.taxFiles = new TaxFileService(httpClient, apiVersion);
    this.downloadCatalogs = new DownloadCatalogService(httpClient, apiVersion);
    this.downloadRules = new DownloadRuleService(httpClient, apiVersion);
    this.downloadRequests = new DownloadRequestService(httpClient, apiVersion);
  }

  /**
   * Crea una nueva instancia del cliente de FiscalAPI
   * @param {FiscalapiSettings} settings - Configuración
   * @returns {IFiscalapiClient} Instancia del cliente de FiscalAPI
   */
  static create(settings: FiscalapiSettings): IFiscalapiClient {
    if (!settings) {
      throw new Error('La configuración no puede ser nula o indefinida');
    }
    
    // Valida la configuración
    FiscalapiClient.validateSettings(settings);
    
    // Establece valores predeterminados para configuraciones opcionales
    settings.apiVersion = settings.apiVersion || 'v4';
    settings.timeZone = settings.timeZone || 'America/Mexico_City';
    settings.debug = settings.debug || false;
    
    return new FiscalapiClient(settings);
  }

  /**
   * Valida la configuración
   * @param {FiscalapiSettings} settings - Configuración
   * @private
   */
  private static validateSettings(settings: FiscalapiSettings): void {
    if (!settings.apiUrl) {
      throw new Error('apiUrl es requerido');
    }
    
    if (!settings.apiKey) {
      throw new Error('apiKey es requerido');
    }
    
    if (!settings.tenant) {
      throw new Error('tenant es requerido');
    }
  }
}
