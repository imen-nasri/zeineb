// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';
  private refreshUrl = 'http://localhost:5000/refresh'

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<any> {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      throw new Error('No token found!');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
    });

    return this.http.get<any>(this.apiUrl, { headers }); 
  }


  // Get a specific user by ID
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Update a user by ID
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user by ID
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  refreshToken(): Observable<any> {
    return this.http.get<any>(this.refreshUrl);  // Refresh the access token
  }
}
