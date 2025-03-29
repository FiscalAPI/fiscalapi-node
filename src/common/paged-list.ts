 
/**
 * Lista paginada genérica para respuestas de la API
 * @template T
 */
export class PagedList<T> {
    /**
     * Número de página actual
     */
    pageNumber!: number;
    
    /**
     * Tamaño de página
     */
    pageSize!: number;
    
    /**
     * Número total de elementos en todas las páginas
     */
    totalItems!: number;
    
    /**
     * Número total de páginas
     */
    totalPages!: number;
    
    /**
     * Indica si hay una página anterior
     */
    hasPreviousPage!: boolean;
    
    /**
     * Indica si hay una página siguiente
     */
    hasNextPage!: boolean;
    
    /**
     * Elementos en la página actual
     */
    items!: T[];
    
    /**
     * Comprueba si la colección está vacía
     * @returns {boolean} Verdadero si la colección está vacía
     */
    isEmpty(): boolean {
      return !this.items || this.items.length === 0;
    }
  }