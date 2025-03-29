 
import axios from 'axios';
import https from 'https';
import { FiscalapiSettings } from '../common/fiscalapi-settings';
import { FiscalapiHttpClient } from './fiscalapi-http-client';
import { IFiscalapiHttpClient } from './fiscalapi-http-client.interface';

/**
 * Fábrica para crear clientes HTTP para FiscalAPI
 */
export class FiscalapiHttpClientFactory {
  private static clients: Map<string, IFiscalapiHttpClient> = new Map();

  /**
   * Crea un nuevo cliente HTTP para FiscalAPI
   * @param {FiscalapiSettings} settings - Configuración de FiscalAPI
   * @returns {IFiscalapiHttpClient} Instancia del cliente HTTP
   */
  public static create(settings: FiscalapiSettings): IFiscalapiHttpClient {
    if (!settings) {
      throw new Error('La configuración no puede ser nula o indefinida');
    }

    // Crea una clave única para cachear el cliente
    const clientKey = `${settings.apiKey}:${settings.tenant}:${settings.apiUrl}`;

    // Devuelve el cliente cacheado si existe
    if (this.clients.has(clientKey)) {
      return this.clients.get(clientKey)!;
    }

    // Agente HTTPS que ignora la validación del certificado autofirmado si está en modo depuración
    const httpsAgent = new https.Agent({
      rejectUnauthorized: settings.debug ? false : true
    });

    // Crea una nueva instancia de axios
    const axiosInstance = axios.create({
      baseURL: settings.apiUrl,
      timeout: 30000, // 30 segundos
      headers: {
        'X-API-KEY': settings.apiKey,
        'X-TENANT-KEY': settings.tenant,
        'X-API-VERSION': settings.apiVersion || 'v4',
        'X-TIMEZONE': settings.timeZone || 'America/Mexico_City',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      httpsAgent: httpsAgent
    });

    // Crea y cachea el cliente
    const client = new FiscalapiHttpClient(axiosInstance);
    this.clients.set(clientKey, client);

    return client;
  }
}