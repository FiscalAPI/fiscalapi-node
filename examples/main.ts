import { FiscalapiClient, FiscalapiSettings } from '../src';

async function main() : Promise<void> {
  
  // Configura el cliente
  const settings: FiscalapiSettings = {
    apiUrl: 'https://localhost:7173',
    apiKey: 'sk_development_e0e47dfa_5146_40c2_b3a3_3055909a6b88',
    tenant: 'e839651d-1765-4cd0-ba7f-547a4c20580f',
  };

  try {
    // Crea el cliente
    console.log('Inicializando cliente de FiscalAPI...');
    const client = FiscalapiClient.create(settings);
    
    // Ejemplo: Listar productos (página 1, 10 elementos por página)
    console.log('Obteniendo producto...');
    const response = await client.products.getById("114a4be5-fb65-40b2-a762-ff0c55c6ebfa",true);
    
    if (response.succeeded) {

      console.log('Exito');
      console.log(JSON.stringify(response.data, null, 2));
      
    } else {
      console.log('Error');
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('Error inesperado:', error);
    
  }
}

// Ejecutar la función principal
main().catch(console.error);