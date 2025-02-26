
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart.model'; // Sửa đúng đường dẫn

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = '/cart'; // Thay bằng URL của API

  constructor(private http: HttpClient) {}

  // Phương thức để lấy danh sách sản phẩm trong giỏ hàng
  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/items`);
  }

  // Phương thức để thêm sản phẩm vào giỏ hàng
  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, { productId, quantity });
  }

  // Phương thức để xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove/${productId}`);
  }

  // Phương thức để cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, { productId, quantity });
  }

  // Phương thức để lưu các sản phẩm đã chọn
  saveSelectedItems(items: CartItem[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveSelectedItems`, { items });
  }

  // Phương thức để cập nhật lại giỏ hàng
  updateCartItems(cartItems: CartItem[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, cartItems);
  }
}