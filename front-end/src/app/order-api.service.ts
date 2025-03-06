import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../../../my-server-mongodb/interface/Cart';

interface OrderData {
  items: CartItem[];
  address: {
    name: string;
    phone: string;
    full_address: string;
  };
  shippingMethod: {
    estimated_delivery: string;
    cost: number;
  };
  totalOrder: number;
  shippingCost: number;
  discountAmount: number;
  finalAmount: number;
}

interface PromoCodeValidationResult {
  isValid: boolean;
  discountAmount: number;
}

interface OrderResponse {
  orderId: string;
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderAPIService {
  private apiUrl = 'http://localhost:5000/api/orders'; // Điều chỉnh URL API của bạn

  constructor(private http: HttpClient) {}

  // Tạo đơn hàng mới
  createOrder(orderData: OrderData): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/create`, orderData);
  }

  // Kiểm tra mã khuyến mãi
  validatePromoCode(promoCode: string): Observable<PromoCodeValidationResult> {
    return this.http.post<PromoCodeValidationResult>(`${this.apiUrl}/validate-promo`, { promoCode });
  }

  // Lấy chi tiết đơn hàng
  getOrderDetails(orderId: string): Observable<OrderData> {
    return this.http.get<OrderData>(`${this.apiUrl}/details/${orderId}`);
  }

  // Lấy lịch sử đơn hàng
  getOrderHistory(): Observable<OrderData[]> {
    return this.http.get<OrderData[]>(`${this.apiUrl}/history`);
  }

  // Hủy đơn hàng
  cancelOrder(orderId: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/cancel/${orderId}`, {});
  }
}