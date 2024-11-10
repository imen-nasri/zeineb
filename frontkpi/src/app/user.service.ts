import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';
  private refreshUrl = 'http://localhost:5000/refresh';

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
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.post<any>(this.apiUrl, user, { headers });
  }

  // Update a user by ID
  updateUser(id: string, user: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, user, { headers });
  }

  // Delete a user by ID (id in body)
deleteUser(id: string): Observable<any> {
  const token = localStorage.getItem('accessToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
  return this.http.delete<any>(`${this.apiUrl}`, {
    body: { id },
    headers
 
  });
}

 

  refreshToken(): Observable<any> {
    return this.http.get<any>(this.refreshUrl);  // Refresh the access token
  }
}