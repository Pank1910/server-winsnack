import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../my-server-mongodb/interface/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = 'http://localhost:5001/products'; // 🔥 Kiểm tra URL API

  constructor(private http: HttpClient) {}

  /** 📌 Lấy toàn bộ sản phẩm */
  getAllProducts(): Observable<{ success: boolean; data: Product[]; count: number }> {
    console.log("🔍 Gửi request GET đến:", this.baseUrl);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(this.baseUrl);
  }

  /** 🔎 Lấy sản phẩm theo danh mục */
  getProductsByCategory(category: string): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}?category=${encodeURIComponent(category)}`;
    console.log("📌 Lọc theo danh mục:", category, "➡️", url);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }

  /** 🔎 Lấy sản phẩm theo ID */
  getProductById(id: string): Observable<{ success: boolean; data: Product }> {
    const url = `${this.baseUrl}/${id}`;
    console.log("📌 Lấy chi tiết sản phẩm ID:", id, "➡️", url);
    return this.http.get<{ success: boolean; data: Product }>(url);
  }

  /** 🏆 Lấy sản phẩm nổi bật */
  getFeaturedProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/featured`;
    console.log("⭐ Lấy sản phẩm nổi bật ➡️", url);
    return this.http.get<Product[]>(url);
  }

  /** 🔥 Lấy sản phẩm bán chạy */
  getBestSellerProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/bestseller`;
    console.log("🔥 Lấy sản phẩm bán chạy ➡️", url);
    return this.http.get<Product[]>(url);
  }

  /** 🆕 Thêm sản phẩm mới */
  addProduct(product: Product): Observable<{ success: boolean; message: string; data: Product }> {
    console.log("📌 Thêm sản phẩm:", product);
    return this.http.post<{ success: boolean; message: string; data: Product }>(this.baseUrl, product);
  }

  /** ✏️ Cập nhật sản phẩm */
  updateProduct(id: string, product: Product): Observable<{ success: boolean; message: string; data: Product }> {
    const url = `${this.baseUrl}/${id}`;
    console.log("✏️ Cập nhật sản phẩm ID:", id, "➡️", url, "➡️", product);
    return this.http.put<{ success: boolean; message: string; data: Product }>(url, product);
  }

  /** ❌ Xóa sản phẩm */
  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    const url = `${this.baseUrl}/${id}`;
    console.log("🗑️ Xóa sản phẩm ID:", id, "➡️", url);
    return this.http.delete<{ success: boolean; message: string }>(url);
  }

  /** 🔍 Tìm kiếm sản phẩm theo từ khóa */
  searchProducts(query: string): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
    console.log("🔎 Tìm kiếm sản phẩm:", query, "➡️", url);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }

  /** 💰 Lọc sản phẩm theo giá */
  filterProductsByPrice(minPrice: number, maxPrice: number): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    console.log("💰 Lọc sản phẩm theo giá:", minPrice, "-", maxPrice, "➡️", url);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }
  deleteCategory(categoryName: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/category/${categoryName}`);
  }
}
