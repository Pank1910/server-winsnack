import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'; // Note: Thêm retry để thử lại khi gọi API thất bại
import { CartItem } from '../../../my-server-mongodb/interface/Cart'; 

@Injectable({
  providedIn: 'root',
})
export class CartAPIService {
  private apiUrl = 'http://localhost:5000/cart'; // Note: Chỉ định rõ URL backend (có thể thay đổi tùy môi trường)

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Note: Nếu bạn sử dụng token-based auth, hãy thêm token từ localStorage hoặc sessionStorage
    return headers;
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => new Error(error.message || 'Server error occurred'));
  }

  getCartItems(userId: string): Observable<CartItem[]> { // Note: Thêm userId làm tham số
    return this.http
      .get<CartItem[]>(`${this.apiUrl}?userId=${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(1), // Note: Thử lại 1 lần nếu thất bại
        catchError(this.handleError)
      );
  }

  addToCart(userId: string, productId: string, quantity: number, unit_price: number): Observable<{ message: string }> { // Note: Thêm userId
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/add`, { userId, productId, quantity, unit_price }, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  removeFromCart(userId: string, productId: string): Observable<{ message: string }> { // Note: Thêm userId
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/remove/${productId}?userId=${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateQuantity(userId: string, productId: string, quantity: number): Observable<{ message: string }> { // Note: Thêm userId
    return this.http
      .patch<{ message: string }>(`${this.apiUrl}/update`, { userId, productId, quantity }, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateCartItems(userId: string, items: { productId: string; quantity: number; unit_price: number }[]): Observable<{ message: string }> { // Note: Thêm userId
    return this.http
      .put<{ message: string }>(`${this.apiUrl}/update-all`, { userId, items }, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  saveSelectedItems(userId: string, selectedItems: CartItem[]): Observable<{ message: string }> { // Note: Thêm userId
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/saveSelectedItems`, { userId, selectedItems }, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  clearCart(userId: string): Observable<{ message: string }> { // Note: Thêm userId
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/clear?userId=${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
}