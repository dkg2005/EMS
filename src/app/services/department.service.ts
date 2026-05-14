// DepartmentService
// Responsible for making HTTP requests related to departments.
// Beginners: keep HTTP logic here; components call these methods and stay focused on UI.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private baseUrl = 'http://localhost:8080/api/department';

  constructor(private http: HttpClient) {}

  save(dept: Department): Observable<any> { // POST to save (create or update depending on backend implementation)
    return this.http.post(`${this.baseUrl}/save`, dept);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`);
  }
}
