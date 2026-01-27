import { FiscalapiClient, FiscalapiSettings } from '../src/index';

async function main(): Promise<void> {
  const settings: FiscalapiSettings = {
    apiUrl: 'https://test.fisalapi.com',
    apiKey: '<API_KEY>',
    tenant: '<TENANT_ID>',
  };

  const client = FiscalapiClient.create(settings);

  // 1. Listar transacciones de timbres
  const list = await client.stamps.getList(1, 10);
  console.log('Lista de transacciones:', list);

  // 2. Obtener transacción por ID
  const transaction = await client.stamps.getById('77678d6d-94b1-4635-aa91-15cdd7423aab');
  console.log('Transacción por ID:', transaction);

  // 3. Transferir timbres
  const transfer = await client.stamps.transferStamps({
    fromPersonId: '2e7b988f-3a2a-4f67-86e9-3f931dd48581',
    toPersonId: '5fd9f48c-a6a2-474f-944b-88a01751d432',
    amount: 1,
    comments: 'Transferencia de prueba'
  });
  console.log('Transferencia:', transfer);

  // 4. Retirar timbres
  const withdraw = await client.stamps.withdrawStamps({
    fromPersonId: '5fd9f48c-a6a2-474f-944b-88a01751d432',
    toPersonId: '2e7b988f-3a2a-4f67-86e9-3f931dd48581',
    amount: 1,
    comments: 'Retiro de prueba'
  });
  console.log('Retiro:', withdraw);
}

main();
