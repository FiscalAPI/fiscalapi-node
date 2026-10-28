/**
 * `InvoicePayment` (obsoleto): los datos bancarios son opcionales, como en `PaymentComplement` y en el complemento de
 * pago del SAT, que los prohíbe con formas de pago como `"01"` (efectivo). Sin ellos el pago compila y no los serializa;
 * con ellos se serializan tal cual. `PaymentComplement.foreignBankName` (NomBancoOrdExt, exigido con XEXX010101000)
 * viaja solo si se asigna.
 */
import { InvoicePayment, PaymentComplement } from '../src/index';

const BANK_KEYS = ['sourceBankTin', 'sourceBankAccount', 'targetBankTin', 'targetBankAccount'];

const BANK_DATA = {
  sourceBankTin: 'BSM970519DU8',
  sourceBankAccount: '1234567891012131',
  targetBankTin: 'BBA830831LJ2',
  targetBankAccount: '1234567890',
};

function payment(paymentFormCode: string): InvoicePayment {
  return {
    paymentDate: '2026-10-08T10:00:00',
    paymentFormCode,
    currencyCode: 'MXN',
    amount: '100.00',
    paidInvoices: [],
  };
}

describe('InvoicePayment datos bancarios', () => {
  test('un pago en efectivo sin datos bancarios no los serializa', () => {
    const sent = JSON.parse(JSON.stringify(payment('01')));

    BANK_KEYS.forEach((key) => expect(key in sent).toBe(false));
  });

  test('con datos bancarios se serializan tal cual', () => {
    const sent = JSON.parse(JSON.stringify({ ...payment('28'), ...BANK_DATA }));

    expect(sent).toMatchObject(BANK_DATA);
  });
});

describe('PaymentComplement.foreignBankName', () => {
  const complement: PaymentComplement = {
    paymentDate: '2026-10-08T10:00:00',
    paymentFormCode: '03',
    currencyCode: 'MXN',
    amount: '100.00',
    paidInvoices: [],
  };

  test('con banco extranjero se serializa', () => {
    const foreign: PaymentComplement = { ...complement, sourceBankTin: 'XEXX010101000', foreignBankName: 'BANK OF TOKY' };

    expect(JSON.parse(JSON.stringify(foreign)).foreignBankName).toBe('BANK OF TOKY');
  });

  test('sin asignarlo no viaja', () => {
    expect('foreignBankName' in JSON.parse(JSON.stringify(complement))).toBe(false);
  });
});
