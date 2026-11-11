import { ApiResponse } from '../common/api-response';
import { MeInfo } from '../models/me';

/**
 * Interfaz del servicio de la persona de la credencial con que se llama al API.
 */
export interface IMeService {
  /**
   * GET /api/v4/me
   * Obtiene la persona de la API key: su id, nombre, RFC y correo, su tenant, el ambiente que responde, si es el owner,
   * lo que puede hacer y sus saldos. Sirve para validar una credencial: con una API key o un tenant que no son válidos
   * responde 401.
   * @returns {Promise<ApiResponse<MeInfo>>} La persona de la credencial
   */
  get(): Promise<ApiResponse<MeInfo>>;
}
