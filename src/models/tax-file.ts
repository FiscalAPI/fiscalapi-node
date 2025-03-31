 
// src/models/tax-file.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo TaxFile
 * Representa un componente individual de un par CSD - ya sea el certificado (.cer) o la llave privada (.key)
 */
export interface TaxFile extends BaseDto  {
  /** Id de la persona propietaria del certificado */
  personId: string;

  /** RFC del propietario del certificado. Debe coincidir con el RFC del certificado */
  tin: string;

  /** Archivo certificado o llave privada en formato base64. Para certificados debe ser el archivo .cer codificado en base64, para llaves privadas debe ser el archivo .key codificado en base64 */
  base64File: string;

  /** Tipo de archivo que se está enviando. Valores: "01" */
  fileType: number;

  /** Contraseña de la llave privada. Independientemente si se envía un certificado o una llave privada, siempre se debe enviar la contraseña de la llave privada */
  password: string;

  /** Fecha de inicio de vigencia del certificado o llave privada. Calculado automáticamente */
  validFrom?: Date;

  /** Fecha de fin de vigencia del certificado o llave privada. Calculado automáticamente */
  validTo?: Date;

  /** Numero de secuencia que identifica el par entre certificado y llave privada. Sólo con fines informativos */
  sequence?: number;
}