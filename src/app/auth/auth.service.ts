import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'}) 
export class AuthService {
    private baseUrl = 'http://localhost:8080/api/auth'; // Backend API base URL

    constructor(private http: HttpClient) {}

    login(data: any){
        return this.http.post<any>(`${this.baseUrl}/login`, data);
    }

    signup(data: any){
        return this.http.post<any>(`${this.baseUrl}/signup`, data);
    }

    logout(){
        localStorage.clear();
    }

    isLoggedIn(): boolean{
        return !!localStorage.getItem('token');
    }

    setUserFromResponse(res: any) {// save user object (safe since it came from backend)
    if (res?.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    if (res?.data?.token) {
      localStorage.setItem('token', res.data.token);
    }
  }

  getCurrentUser(): any | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}