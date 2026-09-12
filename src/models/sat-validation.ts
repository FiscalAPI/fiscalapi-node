// src/models/sat-validation.ts

/**
 * Ids de los tipos de validación del SAT.
 * Los valores son los que expone `GET /api/v4/sat-validations`, en el orden del catálogo.
 */
export const SatValidationTypeIds = {
  /** Estructura del XML contra el Anexo 20 y los complementos declarados. Requiere `xml`. */
  XmlStructure: 'sat.xml.structure',

  /** Vigencia del certificado del emisor al momento de la emisión. Requiere `xml`. */
  CertificateValidity: 'sat.certificate.validity',

  /** Sello del comprobante contra su cadena original. Requiere `xml`. */
  CfdiSello: 'sat.cfdi.sello',

  /** Sello del SAT en el TimbreFiscalDigital. Requiere `xml`. */
  TfdSello: 'sat.tfd.sello',

  /** Estado del comprobante en ConsultaCFDIService. Requiere `xml`. */
  CfdiStatus: 'sat.cfdi.status',

  /** Listado del artículo 69-B CFF. Admite `xml` o `tin`. */
  Blacklist69B: 'sat.blacklist.69b',

  /** Listado del artículo 69-B Bis CFF. Admite `xml` o `tin`. */
  Blacklist69BBis: 'sat.blacklist.69bbis',
} as const;

/**
 * Ids de los estatus que puede tomar una validación al ejecutarse.
 * Un mismo id puede aparecer en varios tipos con distinta descripción y distinto veredicto,
 * por lo que el `passed` siempre se lee de la respuesta y nunca se deduce del id.
 */
export const SatValidationStatusIds = {
  Valido: 'Valido',
  Invalido: 'Invalido',
  Vigente: 'Vigente',
  Expirado: 'Expirado',
  NoVigenteAun: 'NoVigenteAun',
  Cancelado: 'Cancelado',
  NoEncontrado: 'NoEncontrado',
  NoListado: 'NoListado',
  Presunto: 'Presunto',
  Desvirtuado: 'Desvirtuado',
  Definitivo: 'Definitivo',
  SentenciaFavorable: 'SentenciaFavorable',

  /** El servicio externo no respondió. Es resultado de ejecución: responde 200 y consume crédito. */
  NoDisponible: 'NoDisponible',

  /** No se evaluó porque la entrada no lo permite. Responde 200, `passed = false`, y consume crédito. */
  Omitido: 'Omitido',
} as const;

/**
 * Tipo de validación del SAT
 */
export interface SatValidationType {
  /** Id del tipo de validación. Ej. "sat.cfdi.status" */
  id: string;

  /** Descripción de lo que verifica el tipo de validación */
  description: string;
}

/**
 * Estatus que un tipo de validación puede tomar al ejecutarse.
 * Es el elemento de `getStatuses()`; no incluye `details` porque no corresponde a una ejecución.
 */
export interface SatValidationTypeStatus {
  /** Id del estatus. Ej. "Vigente" */
  id: string;

  /** Descripción del estatus para ese tipo de validación */
  description: string;
}

/**
 * Estatus obtenido al ejecutar una validación
 */
export interface SatValidationStatus {
  /** Id del estatus. Ej. "Vigente" */
  id: string;

  /** Descripción del estatus para el tipo de validación ejecutado */
  description: string;

  /**
   * Hechos del caso en texto libre en español (RFC y corte del listado, número de certificado,
   * estado del SAT). Puede ser nulo. No tiene formato garantizado: no parsearlo.
   */
  details?: string;
}

/**
 * Resultado de ejecutar un tipo de validación
 */
export interface SatValidationResult {
  /** Tipo de validación ejecutado */
  type: SatValidationType;

  /** Estatus obtenido */
  status: SatValidationStatus;

  /** Veredicto del estatus obtenido para ese tipo */
  passed: boolean;
}

/**
 * Parámetros para ejecutar validaciones del SAT.
 *
 * `xml` y `tin` son mutuamente excluyentes y uno de los dos es obligatorio:
 * - Con `xml` se puede solicitar cualquier tipo de validación.
 * - Con `tin` únicamente se pueden solicitar listas negras
 *   (`sat.blacklist.69b`, `sat.blacklist.69bbis`).
 *
 * Estas reglas las valida el backend y se reportan como 400 con `succeeded: false`.
 */
export interface SatValidationRequest {
  /** CFDI completo codificado en base64. Excluyente con `tin`. */
  xml?: string;

  /** RFC a consultar. Excluyente con `xml`. Sólo admite tipos de lista negra. */
  tin?: string;

  /**
   * Ids de los tipos de validación a ejecutar. Obligatorio, sin elementos vacíos ni duplicados.
   * Usar las constantes de {@link SatValidationTypeIds}.
   * Cada tipo solicitado consume un crédito de validación.
   */
  validationTypes: string[];
}
