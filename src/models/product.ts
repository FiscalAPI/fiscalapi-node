 
// src/models/product.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo de producto
 */
export class Product extends BaseDto {
  /** Nombre del producto */
  name?: string;
  
  /** Descripción del producto */
  description?: string;
  
  /** Código SKU */
  sku?: string;
  
  /** Código de producto/servicio SAT */
  productCode?: string;
  
  /** Código de unidad SAT */
  unitCode?: string;
  
  /** Precio unitario */
  unitPrice?: number;
  
  /** Código de objeto de impuesto */
  taxObjectCode?: string;
  
  /** Impuestos aplicables al producto */
  taxes?: ProductTax[];
}


/**
 * Impuesto de producto
 */
export interface ProductTax {
    /** Código de impuesto */
    taxCode?: string;
    
    /** Código de tipo de impuesto */
    taxTypeCode?: string;
    
    /** Tasa del impuesto */
    taxRate?: number;
    
    /** Código de bandera de impuesto */
    taxFlagCode?: string;
  }