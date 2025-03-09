import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../my-server-mongodb/interface/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = 'http://localhost:5001/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<{ success: boolean; data: Product[]; count: number }> {
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(this.baseUrl);
  }

  getProductsByCategory(category: string): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}?category=${encodeURIComponent(category)}`;
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }

  getProductById(id: string): Observable<{ success: boolean; data: Product }> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.baseUrl}/${id}`);
  }  

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/featured`);
  }

  getBestSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/bestseller`);
  }
  
}
