import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OrderApiResponse {
  success: boolean;
  data: any[]; // Dữ liệu đơn hàng
  message?: string;
}

export interface OrderDetailApiResponse {
  success: boolean;
  data: any; // Dữ liệu chi tiết đơn hàng và thông tin người dùng
  message?: string;
}

export interface OrderApi {
  id: string;
  customer: string;
  time: string;
  date: string;
  status: 'processing' | 'cancelled' | 'delivered';
  payment: string;
}

export interface OrderDetailApi {
  id: string;
  orderDate: string;
  orderTime: string;
  status: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Lấy danh sách đơn hàng
  getOrders(): Observable<OrderApi[]> {
    return this.http.get<OrderApiResponse>(`${this.apiUrl}/order-admin`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data.map(order => ({
            id: order.orderId,
            customer: order.userName,
            time: new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
            status: order.status.toLowerCase() as 'processing' | 'cancelled' | 'delivered',
            payment: order.paymentMethod
          }));
        }
        return [];
      })
    );
  }

  // Lấy chi tiết đơn hàng theo orderId
  getOrderDetail(orderId: string): Observable<OrderDetailApi> {
    return this.http.get<OrderDetailApiResponse>(`${this.apiUrl}/order-detail-admin/${orderId}`).pipe(
      map(response => {
        if (response.success && response.data) {
          const order = response.data;
          let statusDisplay: string;
          switch (order.status.toLowerCase()) {
            case 'pending':
              statusDisplay = 'Đang giao hàng';
              break;
            case 'completed':
            case 'delivered':
              statusDisplay = 'Đã thanh toán';
              break;
            case 'cancelled':
              statusDisplay = 'Đã hủy';
              break;
            default:
              statusDisplay = 'Không xác định';
          }
          // Tính tổng discount từ items
          const totalDiscount = order.items.reduce((sum: number, item: any) => {
            return sum + (item.product.discount || 0); // Tổng discount từ mỗi item
          }, 0);
  
          return {
            id: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString('vi-VN'),
            orderTime: new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
            status: statusDisplay,
            recipientName: order.contact?.name || order.userName || 'Chưa cung cấp',
            recipientAddress: order.contact?.address || 'Chưa cung cấp',
            recipientPhone: order.contact?.phone || 'Chưa cung cấp',
            items: order.items.map((item: any, index: number) => ({
              id: index + 1,
              name: item.product.product_name,
              price: item.product.unit_price,
              quantity: item.quantity,
              total: item.product.total_price || item.product.unit_price * item.quantity,
              image: item.product.image_1 || 'assets/images/default-product.jpg'
            })),
            subtotal: order.items.reduce((sum: number, item: any) => sum + (item.product.unit_price * item.quantity), 0),
            shippingFee: order.shippingMethod.cost || 0,
            discount: totalDiscount, // Sử dụng tổng discount từ items
            total: order.totalPrice
          };
        }
        throw new Error('Không tìm thấy đơn hàng');
      })
    );
  }
}