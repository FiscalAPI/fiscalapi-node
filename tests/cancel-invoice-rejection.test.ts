/** Cancelar factura con rechazo del SAT: 422, `succeeded` en false y el cuerpo JSON del error en `details`. */
import { FakeApi } from './fake-api';
import { InvoiceService } from '../src/services/invoice-service';
import { ApiResponse, CancelInvoiceRequest, CancelInvoiceResponse } from '../src/index';

const API_VERSION = 'v4';
const INVOICE_ID = '21c39425-9d0a-449b-a7ba-49335b85b062';
const INVOICE_UUID = 'de841944-bd4f-4bb8-adfe-2a2282787c62';

const SAT_REJECTION: ApiResponse<CancelInvoiceResponse> = {
  data: {
    base64CancellationAcknowledgement: 'PD94bWwgdmVyc2lvbj0iMS4wIj8+...',
    invoiceUuids: { [INVOICE_UUID]: '203' },
  },
  succeeded: false,
  message: "Sorry, it's not me, it's you.",
  details: 'SAT 203: el folio fiscal no corresponde al emisor de la solicitud de cancelación.',
  httpStatusCode: 422,
};

test('un rechazo del SAT es 422 y details trae el cuerpo con el acuse y el código por UUID en data', async () => {
  const api = new FakeApi();
  api.respondWith(JSON.stringify(SAT_REJECTION), 422);
  const request: CancelInvoiceRequest = { id: INVOICE_ID, cancellationReasonCode: '02' };

  const response = await new InvoiceService(api.httpClient, API_VERSION).cancel(request);

  expect(response.succeeded).toBe(false);
  expect(response.httpStatusCode).toBe(422);
  const body: ApiResponse<CancelInvoiceResponse> = JSON.parse(response.details);
  expect(body.message).toBe("Sorry, it's not me, it's you.");
  expect(body.details).toBe('SAT 203: el folio fiscal no corresponde al emisor de la solicitud de cancelación.');
  expect(body.data.base64CancellationAcknowledgement).toBe('PD94bWwgdmVyc2lvbj0iMS4wIj8+...');
  expect(body.data.invoiceUuids).toStrictEqual({ [INVOICE_UUID]: '203' });
  expect(api.requests[0].method).toBe('DELETE');
});
