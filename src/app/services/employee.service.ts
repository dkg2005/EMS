import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private base = 'http://localhost:8080/api/employee';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any>{
    return this.http.get(`${this.base}/get`);
  }

  save(e: any): Observable<any> {
    return this.http.post(`${this.base}/save`, e);
  }
}
