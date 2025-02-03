import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true, // Bỏ comment nếu dùng standalone component
  imports: [CommonModule, FormsModule] // Thêm các module cần thiết
})
export class PaymentPageComponent {
  // Promo Code
  promoCode: string = '';
  
  // Product Data
  products: Product[] = [
    {
      id: 1,
      name: 'Bánh tráng sốt bơ',
      price: 25000,
      quantity: 3,
      image: 'assets/images/products/banh-trang-rong-bien.png' 
    },
    {
      id: 2,
      name: 'Bánh tráng sốt bơ',
      price: 25000,
      quantity: 3,
      image: 'assets/images/products/banh-trang-rong-bien.png' 
    },
    {
      id: 3,
      name: 'Bánh tráng sốt bơ',
      price: 25000,
      quantity: 3,
      image: 'assets/images/products/banh-trang-rong-bien.png' 
    },
  ];

  // Address Data
  defaultAddress = {
    name: 'Bảo Trân',
    phone: '0949656822',
    full_address: 'KTX Khu B, Đường Mạc Đĩnh Chi, Phường Linh Xuân, TP. Thủ Đức, TP. Hồ Chí Minh'
  };

  // Shipping Method
  shippingMethod = {
    estimated_delivery: 'Thứ 3, 25/06/2024',
    cost: 30000
  };

  // Tính toán tự động
  get Quantity(): number {
    return this.products.reduce((acc, product) => acc + product.quantity, 0);
  }

  get totalPrice(): number {
    return this.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  }

  get totalOrder(): number {
    return this.totalPrice;
  }

  discountAmount: number = 20000;

  get finalAmount(): number {
    return this.totalOrder + this.shippingMethod.cost - this.discountAmount;
  }

  onSubmitPromoCode(): void {
    // Xử lý mã giảm giá ở đây
    console.log('Applied promo code:', this.promoCode);
    // Có thể cập nhật discountAmount dựa trên promoCode
  }

  onPlaceOrder(): void {
    // Xử lý đặt hàng
    console.log('Placing order...');
  }
}
