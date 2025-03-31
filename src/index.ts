import { Addendum } from './../dist/types/models/invoice.d';
 
// Exportar API pública

// Cliente principal
export { FiscalapiClient } from './services/fiscalapi-client';

// Interfaces
export { IFiscalapiClient } from './abstractions/fiscalapi-client.interface';
export { IFiscalapiService } from './abstractions/fiscalapi-service.interface';
export { IApiKeyService } from './abstractions/api-key-service.interface';
export { ICatalogService } from './abstractions/catalog-service.interface';
export { IInvoiceService } from './abstractions/invoice-service.interface';
export { IPersonService } from './abstractions/person-service.interface';
export { IProductService } from './abstractions/product-service.interface';
export { ITaxFileService } from './abstractions/tax-file-service.interface';

// Modelos
export { ApiKey } from './models/api-key';
export { Person } from './models/person';
export { Product, ProductTax } from './models/product';
export { TaxFile } from './models/tax-file';
export {
  Invoice,
  InvoiceIssuer,
  InvoiceRecipient,
  InvoiceItem,
  InvoiceResponse,
  TaxCredential,
  RelatedInvoice,
  GlobalInformation,
  ItemTax,
  InvoicePayment,
  PaidInvoice,
  PaidInvoiceTax,
  CancelInvoiceRequest,
  CancelInvoiceResponse,
  CreatePdfRequest,
  SendInvoiceRequest
} from './models/invoice';

// Común
export { FiscalapiSettings } from './common/fiscalapi-settings';
export { ApiResponse, ValidationFailure } from './common/api-response';
export { PagedList } from './common/paged-list';
export { FileResponse } from './common/file-response';
export { BaseDto } from './common/base-dto';
export { AuditableDto } from './common/auditable-dto';
export { SerializableDto } from './common/serializable-dto';
export { CatalogDto } from './common/catalog-dto';

// Utilidades
export {
  formatSatDate,
  parseSatDate,
  SAT_DATE_FORMAT
} from './utils/date-utils';

export {
  encodeToBase64,
  decodeFromBase64
} from './utils/encoding-utils';

export {
  isNullOrUndefined,
  isNullOrEmpty,
  isArrayNullOrEmpty,
  isObjectEmpty
} from './utils/validation-utils';