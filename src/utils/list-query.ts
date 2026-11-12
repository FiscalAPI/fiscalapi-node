// src/utils/list-query.ts

/** Un parámetro de la query de una lista; con valor `undefined` o `null` no se envía. */
export type QueryParam = readonly [key: string, value: string | number | null | undefined];

/**
 * Query string de los parámetros con valor, sin el signo `?`, escapados y en el orden en que llegan. Se arma a mano
 * porque axios serializa los arreglos como `llave[]=…`, que el API no lee.
 * @param {ReadonlyArray<QueryParam>} params - Parámetros de la query
 * @returns {string} Query string, vacía si ningún parámetro tiene valor
 */
export function toQueryString(params: ReadonlyArray<QueryParam>): string {
  return params
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

/**
 * Distingue las dos formas de `getList`: con filtros (un objeto, `null` o nada) o con el número de página. Cualquier otro
 * valor se trata como número de página, como lo hacía `getList(pageNumber, pageSize)` con un llamador sin tipos.
 * @param {number | F | null | undefined} pageNumberOrFilters - Primer argumento de `getList`
 * @returns {boolean} true si son filtros
 */
export function isListFilters<F extends object>(
  pageNumberOrFilters: number | F | null | undefined,
): pageNumberOrFilters is F | null | undefined {
  return pageNumberOrFilters === undefined || typeof pageNumberOrFilters === 'object';
}
