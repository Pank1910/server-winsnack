// src/app/pages/account-backup/order-history/order-history.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../../../../my-server-mongodb/interface/Order';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    
  const userId = this.authService.getCurrentUserId();
      
      if (!userId) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: '/account/order-history' } 
        });
        return;
      }  

    // Tải đơn hàng của người dùng
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
      case 'Pending': return 'bg-yellow-200 text-yellow-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'completed': return 'Đã hoàn thành';
      case 'Pending': return 'Đang xử lý';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  }
}
