// sales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:5000/sales/getSalesOverview';

  constructor(private http: HttpClient) {}

  getSalesOverview(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching sales data', error);
        return throwError('Failed to fetch sales data');
      })
    );
  }
}
