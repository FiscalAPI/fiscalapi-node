/**
 * Timbres, créditos de validación y créditos de ticket — /api/v4/stamps
 *
 * El ledger de timbres maneja tres tipos de crédito que nunca se mezclan:
 * CreditType.Stamp (timbres), CreditType.Validation (validaciones del SAT) y CreditType.Ticket (créditos de ticket).
 * La misma operación de transferencia sirve para todos: lo decide el campo creditType.
 */
import {
  ApiResponse,
  CreditBalance,
  CreditType,
  FiscalapiClient,
  FiscalapiSettings,
  IFiscalapiClient,
  PagedList,
  Person,
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

  // 5. Transferir créditos de ticket
  //    Se descuentan del saldo de créditos de ticket, que se lee en balances de la persona.
  const ticketTransferParams: StampTransactionParams = {
    fromPersonId: '2e7b988f-3a2a-4f67-86e9-3f931dd48581',
    toPersonId: '5fd9f48c-a6a2-474f-944b-88a01751d432',
    amount: 100,
    comments: 'Transferencia de créditos de ticket',
    creditType: CreditType.Ticket
  };
  const ticketTransfer: ApiResponse<boolean> = await client.stamps.transferStamps(ticketTransferParams);
  console.log('Transferencia de créditos de ticket:', ticketTransfer);

  // 6. Consultar el saldo de créditos de ticket: el de tipo Ticket en balances (un tipo ausente tiene saldo 0).
  const person: ApiResponse<Person> = await client.persons.getById('5fd9f48c-a6a2-474f-944b-88a01751d432');
  const ticketBalance: number =
    person.data.balances?.find((balance: CreditBalance) => balance.creditType === CreditType.Ticket)?.available ?? 0;
  console.log('Créditos de ticket disponibles:', ticketBalance);

  // 7. Retirar timbres: es una transferencia con el origen y el destino invertidos.
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
