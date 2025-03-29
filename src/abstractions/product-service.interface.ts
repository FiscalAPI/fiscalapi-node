 
// src/abstractions/interfaces/product-service.interface.ts
import { IFiscalapiService } from './fiscalapi-service.interface';
import { Product } from '../models/product';

/**
 * Interfaz del servicio de productos
 */
export interface IProductService extends IFiscalapiService<Product> {
  // Aquí irían métodos específicos para productos
}