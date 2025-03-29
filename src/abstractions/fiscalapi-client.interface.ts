import { IApiKeyService } from './api-key-service.interface';
import { ICatalogService } from './catalog-service.interface';
import { IInvoiceService } from './invoice-service.interface';
import { IPersonService } from './person-service.interface';
import { IProductService } from './product-service.interface';
import { ITaxFileService } from './tax-file-service.interface';

/**
 * Interfaz principal del cliente para FiscalAPI
 */
export interface IFiscalapiClient {
  /**
   * Servicio de facturas
   */
  invoices: IInvoiceService;
  
  /**
   * Servicio de productos
   */
  products: IProductService;
  
  /**
   * Servicio de personas
   */
  persons: IPersonService;
  
  /**
   * Servicio de claves de API
   */
  apiKeys: IApiKeyService;
  
  /**
   * Servicio de catálogos
   */
  catalogs: ICatalogService;
  
  /**
   * Servicio de archivos fiscales
   */
  taxFiles: ITaxFileService;
}