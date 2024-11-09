// src/app/services/sale.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
interface BestSeller {
  _id: string;
  nom: string;
  categorie: string;
  prixUnitaire: number;
  ventesTotales: number;
  revenuTotal: number;
}
@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:5000/sales';

  constructor(private http: HttpClient) {}

  getTurnover(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTurnover`);
  }

  getSalesOverview(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getSalesOverview`);
  }

  addSale(saleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addSale`, saleData);
  }
  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addProduct`, product);
  }
  getBestSeller(): Observable<BestSeller> {
    return this.http.get<BestSeller>(`${this.apiUrl}/getBestSeller`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching best seller:', error);
    return throwError(() => new Error('Error fetching best seller data. Please try again later.'));
  }
}
