import { Product } from '../models/product';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { BaseFiscalapiService } from './base-fiscalapi-service';
import { IProductService } from '..';

/**
 * Implementación del servicio de productos
 */
export class ProductService extends BaseFiscalapiService<Product> implements IProductService {
  /**
   * Crea una nueva instancia del servicio de productos
   * @param {IFiscalapiHttpClient} httpClient - Cliente HTTP
   * @param {string} apiVersion - Versión de la API
   */
  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    super(httpClient, 'products', apiVersion);
  }
}