import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

interface Order {
  id: string;
  orderDate: string;
  orderTime: string;
  status: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order = {
    id: 'DKXJ1H2D3',
    orderDate: '02/12/2024',
    orderTime: '08:49 AM',
    status: 'Đã thanh toán',
    recipientName: 'Linh Linh',
    recipientAddress: 'KTX Khu B, ĐHQG TP HCM',
    recipientPhone: '0123456789',
    items: [
      {
        id: 1,
        name: 'Bánh tráng vị trà xanh chanh dây',
        price: 40000,
        quantity: 2,
        total: 80000,
        image: 'assets/images/banh-trang-tra-xanh.jpg'
      },
      {
        id: 2,
        name: 'Bánh tráng trộn rong biển mè rang',
        price: 25000,
        quantity: 3,
        total: 75000,
        image: 'assets/images/banh-trang-tron.jpg'
      },
      {
        id: 3,
        name: 'Ốt sa tế',
        price: 45000,
        quantity: 1,
        total: 45000,
        image: 'assets/images/ot-sa-te.jpg'
      },
      {
        id: 4,
        name: 'Bánh tráng nướng với mật ong trứng muối',
        price: 60000,
        quantity: 1,
        total: 60000,
        image: 'assets/images/banh-trang-nuong.jpg'
      },
      {
        id: 5,
        name: 'Bộ bình trang DIY tự chế biển quán kem thủ',
        price: 64000,
        quantity: 1,
        total: 64000,
        image: 'assets/images/bo-binh-trang.jpg'
      }
    ],
    subtotal: 324000,
    shippingFee: 15000,
    discount: 15000,
    total: 324000
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Trong thực tế, bạn sẽ lấy orderId từ route và gọi API để lấy chi tiết đơn hàng
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      // this.fetchOrderDetails(orderId);
    });
  }

  // fetchOrderDetails(orderId: string): void {
  //   this.orderService.getOrderById(orderId).subscribe(
  //     (data) => {
  //       this.order = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching order details:', error);
  //     }
  //   );
  // }

  exportOrder(): void {
    // Xử lý xuất hóa đơn
    console.log('Exporting order:', this.order.id);
  }

  goBack(): void {
    this.location.back();
  }
}