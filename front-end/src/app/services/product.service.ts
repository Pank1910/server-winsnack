import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../../../../my-server-mongodb/interface/Product';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000';
  
  constructor(private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}
  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/products`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error('Failed to fetch products');
          }
          
          // Chuyển đổi dữ liệu từ API thành đối tượng Product
          return response.data.map(item => new Product(
            item._id,
            item.productId || "", // Tham số thứ 2 nên là productId
            item.product_name || "",
            item.product_detail || "",
            item.stocked_quantity || 0,
            item.unit_price || 0,
            item.discount || 0,
            item.createdAt || "",
            item.image_1 || "",
            item.image_2 || "",
            item.image_3 || "",
            item.image_4 || "",
            item.image_5 || "",
            item.product_dept || "",
            item.rating || 4,
            item.isNew || false
          ));
        })
      );
  }
  
  getProductById(id: string): Observable<Product> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/products/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error('Failed to fetch product');
          }
          
          const item = response.data;
          return new Product(
            item._id,
            item.productId || "", // Tham số thứ 2 nên là productId
            item.product_name || "",
            item.product_detail || "",
            item.stocked_quantity || 0,
            item.unit_price || 0,
            item.discount || 0,
            item.createdAt || "",
            item.image_1 || "",
            item.image_2 || "",
            item.image_3 || "",
            item.image_4 || "",
            item.image_5 || "",
            item.product_dept || "",
            item.rating || 4,
            item.isNew || false
          );
        })
      );
  }
  
  // Phương thức mới để lấy danh sách sản phẩm yêu thích
  // Phương thức lấy danh sách sản phẩm yêu thích
getFavoriteProducts(): Observable<Product[]> {
    // Lấy danh sách ID từ LocalStorageService
    const favoriteIds = this.localStorageService.getFavoriteIds();
    
    if (favoriteIds.length === 0) {
      return of([]);
    }
    
    // Tạo một mảng các Observable để lấy thông tin chi tiết của từng sản phẩm
    const productObservables = favoriteIds.map((id: string) => 
      this.getProductById(id).pipe(
        catchError(error => {
          console.error(`Lỗi khi lấy sản phẩm ID ${id}:`, error);
          return of(null); // Trả về null nếu có lỗi
        })
      )
    );
    
    // Kết hợp tất cả các Observable thành một Observable duy nhất
    return forkJoin(productObservables).pipe(
      map((products: unknown) => (products as (Product | null)[])
        .filter((product): product is Product => product !== null)
        .map((product) => product)
      )
    ); 
  }
  
  // Xóa hoặc điều chỉnh các phương thức trùng lặp với LocalStorageService
  // Các phương thức toggleFavorite và isFavorite có thể dùng để chuyển tiếp sang LocalStorageService
  toggleFavorite(productId: string): boolean {
    console.log('ProductService.toggleFavorite called for:', productId);
    const isFavorite = this.localStorageService.isFavorite(productId);
    
    if (isFavorite) {
      console.log('Removing from favorites');
      this.localStorageService.removeFromFavorites(productId);
      return false;
    } else {
      console.log('Adding to favorites');
      this.localStorageService.addToFavorites(productId);
      return true;
    }
  }
  
  isFavorite(productId: string): boolean {
    return this.localStorageService.isFavorite(productId);
  }
  
  // Đồng bộ danh sách yêu thích với tài khoản người dùng (khi đăng nhập)
  syncFavoritesWithAccount(userId: string): Observable<boolean> {
    // Lấy danh sách từ localStorage
    const favoritesStr = localStorage.getItem('favoriteProducts');
    const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
    
    // API để lưu danh sách yêu thích vào tài khoản người dùng
    return this.http.post<{success: boolean}>(`${this.apiUrl}/users/${userId}/favorites`, { favorites })
      .pipe(
        map(response => response.success)
      );
  }
}