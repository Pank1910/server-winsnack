import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OrderApiService, OrderDetailApi } from './../../../order-api.service'; // Import service

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: OrderDetailApi = {
    id: '',
    orderDate: '',
    orderTime: '',
    status: '',
    recipientName: '',
    recipientAddress: '',
    recipientPhone: '',
    items: [],
    subtotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 0
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private orderApiService: OrderApiService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        this.fetchOrderDetails(orderId);
      }
    });
  }

  fetchOrderDetails(orderId: string): void {
    this.orderApiService.getOrderDetail(orderId).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (error) => {
        console.error('Lỗi khi tải chi tiết đơn hàng:', error);
      }
    });
  }

  exportOrder(): void {
    console.log('Exporting order:', this.order.id);
  }

  goBack(): void {
    this.location.back();
  }
}