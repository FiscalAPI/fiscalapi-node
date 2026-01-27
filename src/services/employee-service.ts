import { ApiResponse } from '../common/api-response';
import { IFiscalapiHttpClient } from '../http/fiscalapi-http-client.interface';
import { IEmployeeService } from '../abstractions/employee-service.interface';
import { EmployeeData, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models/employee-data';

/**
 * Implementación del servicio de datos de empleado
 */
export class EmployeeService implements IEmployeeService {
  private readonly httpClient: IFiscalapiHttpClient;
  private readonly apiVersion: string;

  constructor(httpClient: IFiscalapiHttpClient, apiVersion: string) {
    this.httpClient = httpClient;
    this.apiVersion = apiVersion;
  }

  private buildEndpoint(personId: string): string {
    return `api/${this.apiVersion}/people/${personId}/employee`;
  }

  async getById(id: string): Promise<ApiResponse<EmployeeData>> {
    return this.httpClient.getByIdAsync<EmployeeData>(this.buildEndpoint(id));
  }

  async create(requestModel: CreateEmployeeRequest): Promise<ApiResponse<EmployeeData>> {
    return this.httpClient.postAsync<EmployeeData, CreateEmployeeRequest>(
      this.buildEndpoint(requestModel.employeePersonId),
      requestModel
    );
  }

  async update(requestModel: UpdateEmployeeRequest): Promise<ApiResponse<EmployeeData>> {
    return this.httpClient.putAsync<EmployeeData, UpdateEmployeeRequest>(
      this.buildEndpoint(requestModel.employeePersonId),
      requestModel
    );
  }

  async delete(personId: string): Promise<ApiResponse<boolean>> {
    return this.httpClient.deleteAsync(this.buildEndpoint(personId));
  }
}
