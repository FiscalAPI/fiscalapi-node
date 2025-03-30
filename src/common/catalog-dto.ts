import { BaseDto } from "./base-dto";


export class CatalogDto extends BaseDto {
    /**
     * Catalog description
     * @example "Catalogo de formas de pago"
     */
    description?: string;
}