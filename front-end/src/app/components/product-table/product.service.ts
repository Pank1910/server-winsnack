import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../../interface/Product';

@Injectable({
  providedIn: 'root'  // Cung cấp ở cấp root để có thể sử dụng trong toàn bộ ứng dụng
})
export class ProductService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

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
            item.product_name,
            item.product_detail,
            item.stocked_quantity,
            item.unit_price,
            item.discount,
            item.createdAt,
            item.image_1,
            item.image_2,
            item.image_3,
            item.image_4,
            item.image_5,
            item.product_dept,
            item.rating,
            item.isNew
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
            item.product_name,
            item.product_detail,
            item.stocked_quantity,
            item.unit_price,
            item.discount,
            item.createdAt,
            item.image_1,
            item.image_2,
            item.image_3,
            item.image_4,
            item.image_5,
            item.product_dept,
            item.rating,
            item.isNew
          );
        })
      );
  }
}