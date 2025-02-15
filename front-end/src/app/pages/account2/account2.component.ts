import { Component } from '@angular/core';

@Component({
  selector: 'app-account2',
  templateUrl: './account2.component.html',
})
export class Account2Component {
  purchaseHistory = [
    { id: 'DNXJFN123', date: '25/11/2025', total: '375.000', paymentStatus: 'Chờ xử lý', shippingStatus: 'Chưa giao hàng' },
    { id: 'DNXJFN122', date: '5/11/2025', total: '305.000', paymentStatus: 'Đã thanh toán', shippingStatus: 'Đã giao hàng' },
  ];
}