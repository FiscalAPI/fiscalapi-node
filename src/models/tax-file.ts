 
// src/models/tax-file.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo de archivo fiscal
 */
export class TaxFile extends BaseDto {
  /** Nombre del archivo */
  fileName?: string;
  
  /** Tipo de archivo */
  fileType?: string;
  
  /** Tipo de contenido */
  contentType?: string;
  
  /** Contenido del archivo en base64 */
  base64Content?: string;
  
  /** ID de la persona asociada */
  personId?: string;
}
