import { BaseDto } from "./base-dto";


export class CatalogDto extends BaseDto {
    /**
     * Catalog description
     * @example "Catalog for all products"
     */
    description?: string;
}