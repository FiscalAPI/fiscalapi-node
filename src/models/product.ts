 
// src/models/product.ts
import { BaseDto } from '../common/base-dto';
import { CatalogDto } from '../common/catalog-dto';

/**
 * Modelo producto
 * Contiene toda la información sobre un producto o servicio
 */
export interface Product extends BaseDto {
  /** Identificador único del producto */
  id?: string;

  /** Descripción o nombre del producto */
  description?: string;

  /** Precio unitario del producto sin impuestos */
  unitPrice?: number;

  /** Código de la unidad de medida. Catálogo del SAT c_ClaveUnidad. Default: "H87" */
  satUnitMeasurementId?: string;

  /** Código de la unidad de medida. Catálogo del SAT c_ClaveUnidad expandido */
  satUnitMeasurement?: CatalogDto;

  /** Código que identifica las obligaciones fiscales del producto. Catálogo del SAT c_ObjetoImp. Default: "02" */
  satTaxObjectId?: string;

  /** Código que identifica las obligaciones fiscales del producto. Catálogo del SAT c_ObjetoImp expandido */
  satTaxObject?: CatalogDto;

  /** Código del producto o servicio. Catálogo del SAT c_ClaveProdServ. Default: "01010101" */
  satProductCodeId?: string;

  /** Código del producto o servicio. Catálogo del SAT c_ClaveProdServ expandido */
  satProductCode?: CatalogDto;
  
  /** Impuestos aplicables al producto. Default: [IVA 16%] */
  productTaxes?: ProductTax[];
}


/**
 * Impuesto de producto
 */
export interface ProductTax {
  /** Id del producto asociado a este impuesto */ 
  productId?: string;

  /** Tasa del impuesto. El valor debe estar entre 0.00000 y 1.000000 p. ej. `0.160000` para un 16% de impuesto */
  rate: number;

  /** Impuesto. Catálogo del SAT c_Impuesto. "001" ISR | "002" IVA | "003" IEPS */
  taxId: string;

  /** Impuesto. Catálogo del SAT c_Impuesto. "001" ISR | "002" IVA | "003" IEPS Expandido */
  tax?: CatalogDto;
   
  /** Naturaleza del impuesto. "T" Traslado o "R" Retención */
  taxFlagId: string;

  /** Naturaleza del impuesto. "T" Traslado o "R" Retención Expandido */
  taxFlag?: CatalogDto;

  /** Tipo de impuesto "Tasa" Tasa | "Cuota" Cuota | "Exento" Exento */
  taxTypeId: string;

  /** Tipo de impuesto "Tasa" Tasa | "Cuota" Cuota | "Exento" Exento Expandido */
  taxType?: CatalogDto;
}