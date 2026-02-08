import { ApiResponse } from '../common/api-response';
import { EmployerData, CreateEmployerRequest, UpdateEmployerRequest } from '../models/employer-data';

/**
 * Interfaz del servicio de datos de empleador
 */
export interface IEmployerService {
  getById(id: string): Promise<ApiResponse<EmployerData>>;
  create(requestModel: CreateEmployerRequest): Promise<ApiResponse<EmployerData>>;
  update(requestModel: UpdateEmployerRequest): Promise<ApiResponse<EmployerData>>;
  delete(personId: string): Promise<ApiResponse<boolean>>;
}
