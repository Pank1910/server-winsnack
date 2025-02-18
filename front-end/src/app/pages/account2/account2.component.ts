import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account2',
  templateUrl: './account2.component.html',
  styleUrls: ['./account2.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Account2Component {
  purchaseHistory = [
    { id: 'DNXJFN123', date: '25/11/2025', total: '375.000', paymentStatus: 'Chờ xử lý', shippingStatus: 'Chưa giao hàng' },
    { id: 'DNXJFN122', date: '5/11/2025', total: '305.000', paymentStatus: 'Đã thanh toán', shippingStatus: 'Đã giao hàng' },
  ];
  
  constructor() {
    // Đảm bảo dữ liệu được khởi tạo
    console.log('PurchaseHistory initialized with:', this.purchaseHistory);
  }
}