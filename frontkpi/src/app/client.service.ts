import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client/client.module';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:5000/sales/clients';
  private apiUrl = 'http://localhost:5000/sales/addClient';
  constructor(private http: HttpClient) {}

  getNewClients(days: number = 30): Observable<any[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<any[]>(`${this.baseUrl}/getNewClients`, { params });
  }
  addClient(client: Client): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, client, { headers });
  }
}
