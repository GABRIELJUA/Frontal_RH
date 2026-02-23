import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';


  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      credentials,
      { withCredentials: true }
    );
  }

    // Logout
  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true } // necesario para borrar la cookie
    );
  }

  checkAuth() {
  return this.http.get(
    `${this.apiUrl}/me`,
    { withCredentials: true }
  );
}


getMe() {
  return this.http.get(`${this.apiUrl}/me`, { withCredentials: true });
}

}
