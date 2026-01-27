//Export public API

export { FiscalapiClient } from './services/fiscalapi-client';
export type { IFiscalapiClient } from './abstractions/fiscalapi-client.interface';

export type { IFiscalapiService, OperationOptions, RequestOptions } from './abstractions/fiscalapi-service.interface';
export type { IApiKeyService } from './abstractions/api-key-service.interface';
export type { ICatalogService } from './abstractions/catalog-service.interface';
export type { IInvoiceService } from './abstractions/invoice-service.interface';
export type { IPersonService } from './abstractions/person-service.interface';
export type { IProductService } from './abstractions/product-service.interface';
export type { ITaxFileService } from './abstractions/tax-file-service.interface';
export type { IDownloadCatalogService } from './abstractions/download-catalog.inteface';
export type { IDownloadRequestService } from './abstractions/download-request.service.interface';
export type { IDownloadRuleService } from './abstractions/download-rule.service.inteface';
export type { IStampService } from './abstractions/stamp-service.interface';

// HTTP types
export type { HttpMethod } from './http/fiscalapi-http-client.interface';

// Models types
export type { ApiKey } from './models/api-key';
export type { Person } from './models/person';
export type { Product, ProductTax } from './models/product';
export type { TaxFile } from './models/tax-file';
export type {
  Invoice,
  InvoiceIssuer,
  TaxCredential,
  InvoiceRecipient,
  InvoiceItem,
  ItemTax,
  GlobalInformation,
  RelatedInvoice,
  InvoiceResponse,
  //Payments
  InvoicePayment,
  PaidInvoice,
  PaidInvoiceTax,
  CancelInvoiceRequest,
  CancelInvoiceResponse,
  CreatePdfRequest,
  SendInvoiceRequest,
  InvoiceStatusRequest,
  InvoiceStatusResponse,

} from './models/invoice';

export type {
  DownloadRule,
  DownloadRequest,
  MetadataItem,
  Xml,
  XmlGlobalInformation,
  XmlIssuer,
  XmlItemCustomsInformation,
  XmlItem,
  XmlItemPropertyAccount,
  XmlItemTax,
  XmlRecipient,
  XmlRelated,
  XmlTax,
  XmlComplement
} from './models/download';

export type {
  StampTransaction,
  StampTransactionParams,
  UserLookupDto
} from './models/stamp';

export {
  StampTransactionType,
  StampTransactionStatus
} from './models/stamp';


// Common types
export type { FiscalapiSettings } from './common/fiscalapi-settings';
export type { ApiResponse, ValidationFailure, ProblemDetails } from './common/api-response';
export type { FileResponse } from './common/file-response';


//Values
export  { PagedList } from './common/paged-list';
export  { BaseDto } from './common/base-dto';
export { AuditableDto } from './common/auditable-dto';
export { SerializableDto } from './common/serializable-dto';
export { CatalogDto } from './common/catalog-dto';
export { formatSatDate, parseSatDate, SAT_DATE_FORMAT } from './utils/date-utils';
export { encodeToBase64, decodeFromBase64 } from './utils/encoding-utils';
export { isNullOrUndefined, isNullOrEmpty, isArrayNullOrEmpty, isObjectEmpty } from './utils/validation-utils';