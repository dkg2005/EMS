import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset } from '../models/asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private baseUrl = 'http://localhost:8080/api/asset';

  constructor(private http: HttpClient) {}

  save(asset: Asset): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, asset);
  }

  getAll(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/get`);
  }
}
