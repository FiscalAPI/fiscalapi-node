 
// src/models/tax-file.ts
import { BaseDto } from '../common/base-dto';

/**
 * Modelo TaxFile
 * Representa un componente individual de un par CSD - ya sea el certificado (.cer) o la llave privada (.key)
 */
export interface TaxFile extends BaseDto  {
  /** Id de la persona propietaria del certificado */
  personId: string;

  /**
   * RFC de la persona. Opcional al subir: si se omite o va vacío, el API usa el RFC de la persona; si se envía, debe ser
   * el RFC de la persona (sin distinguir mayúsculas) o responde 400 con la falla en Tin. El API no guarda el valor
   * enviado: en las respuestas siempre trae el RFC de la persona
   */
  tin?: string;

  /** Archivo certificado o llave privada en formato base64. Para certificados debe ser el archivo .cer codificado en base64, para llaves privadas debe ser el archivo .key codificado en base64 */
  base64File: string;

  /** Tipo de archivo, como número: 0 = certificado CSD (.cer), 1 = llave privada CSD (.key), 2 = certificado FIEL (.cer), 3 = llave privada FIEL (.key). El API valida el valor: otro (por ejemplo 4, Pfx) responde 400 en FileType */
  fileType: number;

  /**
   * Contraseña de la llave privada. Independientemente si se envía un certificado o una llave privada, siempre se debe enviar la contraseña de la llave privada.
   * Solo se envía al subir (`taxFiles.create()`): en las consultas (`getList()`, `getById()` y la respuesta de `create()`) el API la devuelve vacía (`""`); solo `getDefaultValues()` la devuelve
   */
  password: string;

  /** Fecha de inicio de vigencia del certificado o llave privada. Calculado automáticamente */
  validFrom?: Date;

  /** Fecha de fin de vigencia del certificado o llave privada. Calculado automáticamente */
  validTo?: Date;

  /** Numero de secuencia que identifica el par entre certificado y llave privada. Sólo con fines informativos */
  sequence?: number;
}