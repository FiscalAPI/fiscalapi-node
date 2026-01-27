import { ApiResponse } from '../common/api-response';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { IEmployerService } from '../abstractions/employer-service.interface';
import { EmployerData, CreateEmployerRequest, UpdateEmployerRequest } from '../models/employer-data';

/**
 * Implementación del servicio de datos de empleador
 */
export class EmployerService implements IEmployerService {
  private readonly httpClient: IFiscalapiHttpClient;
  private readonly apiVersion: string;

  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    this.httpClient = httpClient;
    this.apiVersion = apiVersion;
  }

  private buildEndpoint(personId: string): string {
    return `api/${this.apiVersion}/people/${personId}/employer`;
  }

  async getById(id: string): Promise<ApiResponse<EmployerData>> {
    return this.httpClient.getByIdAsync<EmployerData>(this.buildEndpoint(id));
  }

  async create(requestModel: CreateEmployerRequest): Promise<ApiResponse<EmployerData>> {
    return this.httpClient.postAsync<EmployerData, CreateEmployerRequest>(
      this.buildEndpoint(requestModel.personId),
      requestModel
    );
  }

  async update(requestModel: UpdateEmployerRequest): Promise<ApiResponse<EmployerData>> {
    return this.httpClient.putAsync<EmployerData, UpdateEmployerRequest>(
      this.buildEndpoint(requestModel.personId),
      requestModel
    );
  }

  async delete(personId: string): Promise<ApiResponse<boolean>> {
    return this.httpClient.deleteAsync(this.buildEndpoint(personId));
  }
}
