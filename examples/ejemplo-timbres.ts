/**
 * Timbres y créditos de validación — /api/v4/stamps
 *
 * El ledger de timbres maneja dos tipos de crédito que nunca se mezclan:
 * CreditType.Stamp (timbres) y CreditType.Validation (validaciones del SAT).
 * La misma operación de transferencia sirve para ambos: lo decide el campo creditType.
 */
import {
  ApiResponse,
  CreditType,
  FiscalapiClient,
  FiscalapiSettings,
  IFiscalapiClient,
  PagedList,
  StampTransaction,
  StampTransactionParams,
} from '../src/index';

// Configuración de FiscalAPI
const settings: FiscalapiSettings = {
  apiUrl: 'https://test.fiscalapi.com', // https://live.fiscalapi.com
  apiKey: '<api-key>', // API key de FiscalAPI
  tenant: '<tenant>', // Tenant de FiscalAPI
  debug: true // true, imprime raw request y response en consola, util durante el desarrollo de la integración.
};

async function main(): Promise<void> {
  const client: IFiscalapiClient = FiscalapiClient.create(settings);

  // 1. Listar transacciones de timbres
  const list: ApiResponse<PagedList<StampTransaction>> = await client.stamps.getList(1, 10);
  console.log('Lista de transacciones:', list);

  // 2. Obtener transacción por ID
  const transaction: ApiResponse<StampTransaction> = await client.stamps.getById(
    '77678d6d-94b1-4635-aa91-15cdd7423aab'
  );
  console.log('Transacción por ID:', transaction);

  // 3. Transferir timbres
  //    Si se omite creditType, el backend transfiere timbres (CreditType.Stamp).
  const transferParams: StampTransactionParams = {
    fromPersonId: '2e7b988f-3a2a-4f67-86e9-3f931dd48581',
    toPersonId: '5fd9f48c-a6a2-474f-944b-88a01751d432',
    amount: 1,
    comments: 'Transferencia de prueba'
  };
  const transfer: ApiResponse<boolean> = await client.stamps.transferStamps(transferParams);
  console.log('Transferencia:', transfer);

  // 4. Transferir créditos de validación del SAT
  //    Se descuentan del saldo de validaciones (availableValidationBalance), no del de timbres.
  const validationTransferParams: StampTransactionParams = {
    fromPersonId: '2e7b988f-3a2a-4f67-86e9-3f931dd48581',
    toPersonId: '5fd9f48c-a6a2-474f-944b-88a01751d432',
    amount: 1,
    comments: 'Transferencia de créditos de validación',
    creditType: CreditType.Validation
  };
  const validationTransfer: ApiResponse<boolean> = await client.stamps.transferStamps(
    validationTransferParams
  );
  console.log('Transferencia de validaciones:', validationTransfer);

  // 5. Retirar timbres: es una transferencia con el origen y el destino invertidos.
  const withdrawParams: StampTransactionParams = {
    fromPersonId: '5fd9f48c-a6a2-474f-944b-88a01751d432',
    toPersonId: '2e7b988f-3a2a-4f67-86e9-3f931dd48581',
    amount: 1,
    comments: 'Retiro de prueba'
  };
  const withdraw: ApiResponse<boolean> = await client.stamps.transferStamps(withdrawParams);
  console.log('Retiro:', withdraw);
}

main();
