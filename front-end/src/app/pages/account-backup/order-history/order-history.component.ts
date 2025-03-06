// src/app/pages/account-backup/order-history/order-history.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrderService } from '../../../services/order-api.service';
import { Order } from '../../../../../../my-server-mongodb/interface/Order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  hasOrders: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    // ID cố định để test
    const userId = '6728c0ae6192805738f87721';
    
    this.orderService.getUserOrders(userId).subscribe({
      next: (result) => {
        console.log('✅ Dữ liệu đơn hàng nhận từ API:', result);

        // Nếu backend trả về dạng { success, orders, hasOrders }
        if (result.success) {
          this.orders = result.orders || [];
          this.hasOrders = result.hasOrders;
        } else {
          this.error = 'Không thể lấy dữ liệu đơn hàng.';
          this.hasOrders = false;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Lỗi khi lấy đơn hàng:', error);
        this.error = 'Lỗi kết nối. Vui lòng thử lại sau.';
        this.hasOrders = false;
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'completed': return 'bg-green-200 text-green-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'completed': return 'Đã hoàn thành';
      case 'pending': return 'Đang xử lý';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  }
}
