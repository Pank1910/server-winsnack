import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../my-server-mongodb/interface/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = 'http://localhost:5000/products';

  private http = inject(HttpClient); // ✅ Tránh lỗi Circular Dependency

  /** 🔍 Lấy tất cả sản phẩm */
  getAllProducts(): Observable<{ success: boolean; data: Product[]; count: number }> {
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(this.baseUrl);
  }

  /** 🔎 Lấy sản phẩm theo danh mục */
  getProductsByCategory(category: string): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}?category=${encodeURIComponent(category)}`;
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }

  /** 🔎 Lấy sản phẩm theo ID */
  getProductById(id: string): Observable<{ success: boolean; data: Product }> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.baseUrl}/${id}`);
  }

  /** 🏆 Lấy sản phẩm nổi bật */
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/featured`);
  }

  /** 🔥 Lấy sản phẩm bán chạy */
  getBestSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/bestseller`);
  }

  /** 🆕 Thêm sản phẩm mới */
  addProduct(product: Product): Observable<{ success: boolean; message: string; data: Product }> {
    return this.http.post<{ success: boolean; message: string; data: Product }>(this.baseUrl, product);
  }

  /** ✏️ Cập nhật sản phẩm */
  updateProduct(id: string, product: Product): Observable<{ success: boolean; message: string; data: Product }> {
    return this.http.put<{ success: boolean; message: string; data: Product }>(`${this.baseUrl}/${id}`, product);
  }

  /** ❌ Xóa sản phẩm */
  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }

  /** 🔍 Tìm kiếm sản phẩm theo từ khóa */
  searchProducts(query: string): Observable<{ success: boolean; data: Product[]; count: number }> {
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }

  /** 💰 Lọc sản phẩm theo giá */
  filterProductsByPrice(minPrice: number, maxPrice: number): Observable<{ success: boolean; data: Product[]; count: number }> {
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(`${this.baseUrl}?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  }
  
}
