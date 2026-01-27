import { DateTime } from 'luxon';


/**
 * Formato de fecha SAT (para facturas mexicanas)
 */
export const SAT_DATE_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss';

/**
 * Formatea una fecha de acuerdo al formato de fecha SAT
 * @param {Date|string|DateTime} date - Fecha a formatear
 * @returns {string} Cadena de fecha formateada
 */
export function formatSatDate(date: Date | string | DateTime): string {
  if (typeof date === 'string') {
    return DateTime.fromISO(date).toFormat(SAT_DATE_FORMAT);
  } else if (date instanceof Date) {
    return DateTime.fromJSDate(date).toFormat(SAT_DATE_FORMAT);
  } else if (date instanceof DateTime) {
    return date.toFormat(SAT_DATE_FORMAT);
  }
  
  throw new Error('Formato de fecha inválido');
}

/**
 * Analiza una cadena de formato de fecha SAT en un objeto DateTime
 * @param {string} dateStr - Cadena de fecha en formato SAT
 * @returns {DateTime} Objeto DateTime
 */
export function parseSatDate(dateStr: string): DateTime {
  return DateTime.fromFormat(dateStr, SAT_DATE_FORMAT);
}
