import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../my-server-mongodb/interface/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private baseUrl = 'http://localhost:5000/products';

  constructor(private http: HttpClient) {}

  /** 📌 Fetch all products */
  getAllProducts(): Observable<{ success: boolean; data: Product[]; count: number }> {
    console.log("🔍 Sending GET request to:", this.baseUrl);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(this.baseUrl);
  }

  /** 🔎 Fetch products by category */
  getProductsByCategory(category: string): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}?category=${encodeURIComponent(category)}`;
    console.log("📌 Filter by category:", category, "➡️", url);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }

  /** 🔎 Fetch product by ID */
  getProductById(id: string): Observable<{ success: boolean; data: Product }> {
    const url = `${this.baseUrl}/${id}`;
    console.log("📌 Fetch product details ID:", id, "➡️", url);
    return this.http.get<{ success: boolean; data: Product }>(url);
  }

  /** 🏆 Fetch featured products */
  getFeaturedProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/featured`;
    console.log("⭐ Fetch featured products ➡️", url);
    return this.http.get<Product[]>(url);
  }

  /** 🔥 Fetch best-seller products */
  getBestSellerProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/bestseller`;
    console.log("🔥 Fetch best-seller products ➡️", url);
    return this.http.get<Product[]>(url);
  }

  /** 🆕 Add new product */
  addProduct(product: Product): Observable<{ success: boolean; message: string; data: Product }> {
    console.log("📌 Add product:", product);
    return this.http.post<{ success: boolean; message: string; data: Product }>(this.baseUrl, product);
  }

  /** ✏️ Update product */
  updateProduct(id: string, product: Product): Observable<{ success: boolean; message: string; data: Product }> {
    const url = `${this.baseUrl}/${id}`;
    console.log("✏️ Update product ID:", id, "➡️", url, "➡️", product);
    return this.http.put<{ success: boolean; message: string; data: Product }>(url, product);
  }

  /** ❌ Delete product */
  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    const url = `${this.baseUrl}/${id}`;
    console.log("🗑️ Delete product ID:", id, "➡️", url);
    return this.http.delete<{ success: boolean; message: string }>(url);
  }

  /** 🔍 Search products by keyword */
  searchProducts(query: string): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
    console.log("🔎 Search products:", query, "➡️", url);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }

  /** 💰 Filter products by price */
  filterProductsByPrice(minPrice: number, maxPrice: number): Observable<{ success: boolean; data: Product[]; count: number }> {
    const url = `${this.baseUrl}?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    console.log("💰 Filter products by price:", minPrice, "-", maxPrice, "➡️", url);
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(url);
  }

  deleteCategory(categoryName: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/category/${categoryName}`);
  }
}
