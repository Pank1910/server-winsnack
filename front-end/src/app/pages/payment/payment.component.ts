import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AddressService } from "../../services/address.service";
import { Cart2Service } from "./cart2.service";
import { CartItem } from '../../../../../my-server-mongodb/interface/Cart';
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
  imports: [CommonModule, FormsModule, RouterModule] // Thêm các module cần thiết
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
  estimated_delivery: 'dự kiến 3-5 ngày',
  cost: 20000 // Phí vận chuyển mặc định
};

// Các thuộc tính thanh toán
promoCode: string = '';
totalOrder: number = 0;
totalPrice: number = 0;
discountAmount: number = 0;
finalAmount: number = 0;
Quantity: number = 0;

// Phương thức thanh toán mới
isPaymentMethodsVisible: boolean = false;
selectedPaymentMethod: string = 'cod'; // Mặc định là COD
isQRModalVisible: boolean = false;
isConfirmModalVisible: boolean = false;
orderCode: string = '';

constructor(
  private cartService: Cart2Service,
  private addressService: AddressService,
  private orderService: OrderAPIService,
  private router: Router
) {}

ngOnInit(): void {
  // Subscribe to cart changes
  this.cartService.cartItems$.subscribe(items => {
    console.log('Cart items updated:', items);
    this.selectedItems = items.filter(item => item.quantity > 0);
    this.Quantity = this.selectedItems.reduce((total, item) => total + item.quantity, 0);
    this.calculateTotalPrice();
  });
  
  this.loadDefaultAddress();
}

// Tải danh sách sản phẩm đã chọn từ giỏ hàng
// Trong payment.component.ts
loadSelectedItems(): void {
  this.selectedItems = this.cartService.getSelectedItems();
  console.log('Các mục đã chọn để thanh toán:', this.selectedItems);
  this.Quantity = this.selectedItems.reduce((total, item) => total + item.quantity, 0);
  
  if (this.selectedItems.length === 0) {
    console.warn('Không có mục nào được chọn để thanh toán');
  }
}

// Tải địa chỉ mặc định
loadDefaultAddress(): void {
  // Lấy userId từ localStorage hoặc bất kỳ nguồn nào bạn đang lưu trữ
  const userId = localStorage.getItem('userId') || '123457';
  
  // Nếu bạn muốn lấy từ server
  this.addressService.getUserAddress(userId).subscribe({
    next: (address) => {
      this.defaultAddress = {
        name: address.profileName,
        phone: address.phone || '',
        full_address: address.address || 'Chưa có địa chỉ'
      };
    },
    error: (err) => {
      console.error('Lỗi khi lấy địa chỉ từ server:', err);
      // Sử dụng địa chỉ mặc định từ localStorage
      const defaultAddr = this.addressService.getDefaultAddress();
      this.defaultAddress = {
        name: defaultAddr.profileName,
        phone: defaultAddr.phone || '',
        full_address: defaultAddr.address || 'Chưa có địa chỉ'
      };
    }
  });
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
    'WINSNACK20': 20000,
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

// Logic mới - Phương thức thanh toán
togglePaymentMethods(): void {
  this.isPaymentMethodsVisible = !this.isPaymentMethodsVisible;
}

// Lấy tên hiển thị của phương thức thanh toán
getPaymentMethodName(): string {
  switch (this.selectedPaymentMethod) {
    case 'cod': return 'khi nhận hàng';
    case 'banking': return 'chuyển khoản ngân hàng';
    case 'momo': return 'qua ví MoMo';
    default: return '';
  }
}

// Tạo mã đơn hàng ngẫu nhiên
generateOrderCode(): string {
  if (!this.orderCode) {
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.orderCode = `WS${random}`;
  }
  return this.orderCode;
}

// Hiển thị modal QR code
showQRModal(): void {
  this.isQRModalVisible = true;
  this.generateOrderCode();
}

// Đóng modal QR code
closeQRModal(): void {
  this.isQRModalVisible = false;
}
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

  // Tạo mã đơn hàng ngẫu nhiên
  this.generateOrderCode();

  // Xử lý theo phương thức thanh toán
  if (this.selectedPaymentMethod === 'banking' || this.selectedPaymentMethod === 'momo') {
    // Hiển thị QR code để thanh toán
    this.showQRModal();
  } else {
    // Tiến hành lưu đơn hàng ngay (COD)
    this.processOrder();
  }
}

// Phương thức mới để xử lý việc lưu đơn hàng
processOrder(): void {
  // Tạo đối tượng đơn hàng
  const orderData = {
    orderId: this.orderCode,
    userId: localStorage.getItem('userId') || '123457',
    userName: this.defaultAddress.name,
    items: this.selectedItems.map(item => ({
      product: {
        productId: item.productId,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: this.discountAmount,
        total_price: item.unit_price * item.quantity
      },
      quantity: item.quantity
    })),
    shippingMethod: {
      estimated_delivery: this.shippingMethod.estimated_delivery,
      cost: this.shippingMethod.cost
    },
    totalPrice: this.finalAmount,
    contact: {
      address: this.defaultAddress.full_address,
      phone: this.defaultAddress.phone
    },
    additionalNotes: "", // Có thể thêm trường để người dùng nhập ghi chú
    paymentMethod: this.selectedPaymentMethod,
    createdAt: new Date(),
    status: this.selectedPaymentMethod === 'cod' ? 'Đang xử lý' : 'Đã thanh toán'
  };

  // Lưu đơn hàng và chuyển hướng
  this.orderService.saveOrder(orderData).subscribe({
    next: (response) => {
      console.log('Đơn hàng được lưu thành công:', response);
      // Đảm bảo xóa giỏ hàng hoàn thành trước khi chuyển hướng
      this.cartService.clearCart().subscribe({
        next: () => {
          console.log('Giỏ hàng đã được xóa thành công');
          // Hiển thị modal xác nhận thay vì chuyển hướng ngay
          this.isConfirmModalVisible = true;
        },
        error: (clearError:any) => {
          console.error('Lỗi khi xóa giỏ hàng:', clearError);
          // Vẫn hiển thị modal
          this.isConfirmModalVisible = true;
        }
      });
    },
    error: (error) => {
      console.error('Lỗi chi tiết khi lưu đơn hàng:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
      // Không xóa giỏ hàng hoặc chuyển hướng nếu lưu thất bại
    }
  });
}

// Xác nhận đã thanh toán
verifyPayment(): void {
  // Đóng modal QR trước
  this.isQRModalVisible = false;
  
  // Sau đó xử lý đơn hàng và lưu vào database
  setTimeout(() => {
    this.processOrder();
  }, 300);
}

// Đóng modal xác nhận và chuyển hướng
closeConfirmModal(): void {
  this.isConfirmModalVisible = false;
  this.router.navigate(['/order-confirmation', this.orderCode]);
}
}