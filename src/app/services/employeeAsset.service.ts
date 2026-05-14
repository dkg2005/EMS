import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAssetService {

  // Adjust port/path if necessary
  private baseUrl = 'http://localhost:8080/api/employee-asset'; 
  private userUrl = 'http://localhost:8080/api/employee'; // Assuming this exists
  private assetUrl = 'http://localhost:8080/api/asset';   // Assuming this exists

  constructor(private http: HttpClient) {}

  /* ===================== GET MAPPINGS ===================== */
  // Matches your SQL Query return type
  getAll(employeeId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (employeeId !== undefined && employeeId !== -1) {
      params = params.set('employee_id', employeeId.toString());
    }
    // Returns List<Map<String, Object>>
    return this.http.get<any[]>(`${this.baseUrl}/get`, { params });
  }

  /* ===================== SAVE / UPDATE ===================== */
  // Matches DTO: EmployeeAssetRequestDTO { employeeIds, assetIds, flag }
  save(payload: {
    employeeIds: number[];
    assetIds: number[];
    flag: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save`, payload);
  }

  /* ===================== DELETE ===================== */
  deleteByEmployee(employeeId: number): Observable<any> {
    const payload = {
      employeeIds: [employeeId],
      assetIds: [],
      flag: 'DELETE'
    };
    return this.http.post<any>(`${this.baseUrl}/save`, payload);
  }

  /* ===================== DROPDOWNS ===================== */
  getEmployees(): Observable<any[]> {
    // Fetch all employees for the dropdown
    return this.http.get<any[]>(`${this.userUrl}/get`); 
  }

  getAssets(): Observable<any[]> {
    // Fetch all assets for the dropdown
    return this.http.get<any[]>(`${this.assetUrl}/get`);
  }
}