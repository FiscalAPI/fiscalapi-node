import { ApiResponse } from '../common/api-response';
import { EmployeeData, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models/employee-data';

/**
 * Interfaz del servicio de datos de empleado
 */
export interface IEmployeeService {
  getById(id: string): Promise<ApiResponse<EmployeeData>>;
  create(requestModel: CreateEmployeeRequest): Promise<ApiResponse<EmployeeData>>;
  update(requestModel: UpdateEmployeeRequest): Promise<ApiResponse<EmployeeData>>;
  delete(personId: string): Promise<ApiResponse<boolean>>;
}
