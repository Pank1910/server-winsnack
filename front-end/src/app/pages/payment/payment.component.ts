import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from "../../services/address.service";
import { Cart2Service } from "../../services/cart2.service";
import { CartItem } from '../../../../../my-server-mongodb/interface/Cart';
import { User } from '../../../../../my-server-mongodb/interface/User';
import { OrderAPIService } from "../../order-api.service";

interface DefaultAddress {
  name: string;
  phone: string;
  full_address: string;
}

interface ShippingMethod {
  estimated_delivery: string;
  cost: number;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true, // Bỏ comment nếu dùng standalone component
  imports: [CommonModule, FormsModule] // Thêm các module cần thiết
})
export class PaymentPageComponent implements OnInit {
// Danh sách sản phẩm đã chọn
selectedItems: CartItem[] = [];
  
// Địa chỉ mặc định
defaultAddress: DefaultAddress = {
  name: '',
  phone: '',
  full_address: ''
};

// Phương thức vận chuyển
shippingMethod: ShippingMethod = {
  estimated_delivery: 'Dự kiến 3-5 ngày',
  cost: 30000 // Phí vận chuyển mặc định
};

// Các thuộc tính thanh toán
promoCode: string = '';
totalOrder: number = 0;
totalPrice: number = 0;
discountAmount: number = 0;
finalAmount: number = 0;
Quantity: number = 0;

constructor(
  private cartService: Cart2Service,
  private addressService: AddressService,
  private orderService: OrderAPIService,
  private router: Router
) {}

ngOnInit(): void {
  this.loadSelectedItems();
  this.loadDefaultAddress();
  this.calculateTotalPrice();
}

// Tải danh sách sản phẩm đã chọn từ giỏ hàng
loadSelectedItems(): void {
  this.selectedItems = this.cartService.getSelectedItems();
  this.Quantity = this.selectedItems.reduce((total, item) => total + item.quantity, 0);
}

// Tải địa chỉ mặc định
loadDefaultAddress(): void {
  // Điều chỉnh để phù hợp với cấu trúc mới của UserAddress
  const address = this.addressService.getDefaultAddress();
  this.defaultAddress = {
    name: address.profileName,
    phone: address.phone || '',
    full_address: address.address || 'Chưa có địa chỉ'
  };
}

// Tính tổng giá trị đơn hàng
calculateTotalPrice(): void {
  this.totalOrder = this.selectedItems.reduce((total, item) => 
    total + (item.unit_price * item.quantity), 0);
  
  this.totalPrice = this.totalOrder;
  this.finalAmount = this.totalOrder + this.shippingMethod.cost - this.discountAmount;
}

// Xử lý áp dụng mã khuyến mãi
onSubmitPromoCode(): void {
  // Định nghĩa kiểu cho validPromoCodes
  const validPromoCodes: Record<string, number> = {
    'WINSNACK10': 10000,
    'GIAMGIA20': 20000,
    'FIRST ORDER': 15000
  };

  if (this.promoCode && validPromoCodes.hasOwnProperty(this.promoCode)) {
    this.discountAmount = validPromoCodes[this.promoCode];
    this.calculateTotalPrice();
    alert(`Áp dụng mã giảm giá ${this.promoCode} thành công!`);
  } else {
    alert('Mã khuyến mãi không hợp lệ');
    this.discountAmount = 0;
    this.calculateTotalPrice();
  }
}

// Thuộc tính modal và form mới
isModalVisible: boolean = false;
modalPaymentMethod: string = '';
 // Mở modal thanh toán
openModal(paymentMethod: string): void {
  this.modalPaymentMethod = paymentMethod;
  this.isModalVisible = true;
}

// Đóng modal
closeModal(): void {
  this.isModalVisible = false;
}

// Xử lý phương thức thanh toán
// const paymentMethod = this.paymentForm.value.paymentMethod;

// if (paymentMethod === 'internet_banking' || paymentMethod === 'momo') {
//   this.openModal(paymentMethod);
// } else {
//   this.processOrder(orderData);
// }
// }

// Xử lý đặt hàng
onPlaceOrder(): void {
  // Kiểm tra các điều kiện trước khi đặt hàng
  if (!this.defaultAddress.name) {
    alert('Vui lòng chọn địa chỉ giao hàng');
    return;
  }

  if (this.selectedItems.length === 0) {
    alert('Giỏ hàng của bạn đang trống');
    return;
  }

  // Tạo đối tượng đơn hàng
  const orderData = {
    items: this.selectedItems,
    address: this.defaultAddress,
    shippingMethod: this.shippingMethod,
    totalOrder: this.totalOrder,
    shippingCost: this.shippingMethod.cost,
    discountAmount: this.discountAmount,
    finalAmount: this.finalAmount,
    orderDate: new Date(),
    orderStatus: 'Đang xử lý'
  };

  // Hiển thị thông tin đơn hàng ngay tại component
  alert(`
    Đặt hàng thành công!
    Tổng số tiền: ${this.finalAmount.toLocaleString()} VNĐ
    Địa chỉ: ${this.defaultAddress.name}, ${this.defaultAddress.full_address}
    Số điện thoại: ${this.defaultAddress.phone}
  `);

  // Xóa giỏ hàng 
  this.cartService.clearCart();

  // Reset form thanh toán
  this.selectedItems = [];
  this.totalOrder = 0;
  this.finalAmount = 0;
  this.discountAmount = 0;
}
}
