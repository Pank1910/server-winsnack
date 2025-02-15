import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Cart, Product } from '../models/cart.model';  // Sử dụng đúng các kiểu từ cart.model.ts
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  style: string = "none";
  products: Product[] = [];  // Sử dụng đúng kiểu mảng Product
  stringPrice: string = "";
  totalPrice: number = 0;
  cart: Cart = { products: [] };  // Cart chỉ có 1 mảng products
  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getCart(); // Lấy giỏ hàng khi component được khởi tạo
  }

  closeModal() {
    this.modalService.close(); // Đóng modal
  }

  // Tăng số lượng sản phẩm trong giỏ hàng
  increaseQuantity(productID: string) {
    const product = this.cart.products.find(p => p.productID === productID);
    if (product) {
      product.quantity += 1;
    }
    this.updateCart(); // Cập nhật giỏ hàng sau khi thay đổi số lượng
  }

  // Giảm số lượng sản phẩm trong giỏ hàng
  decreaseQuantity(productID: string) {
    const product = this.cart.products.find(p => p.productID === productID);
    if (product && product.quantity > 1) {
      product.quantity -= 1;
    }
    this.updateCart(); // Cập nhật giỏ hàng sau khi thay đổi số lượng
  }

  // Lấy số tiền thô từ một chuỗi giá trị
  getRawNumber(x: string): number {
    try {
      return Number(x.replace(",", '')); // Chuyển chuỗi giá trị thành số
    } catch (e) {
      return 0; // Trả về 0 nếu có lỗi
    }
  }

  // Tính toán tổng giá trị giỏ hàng
  calculateTotalPrice() {
    this.totalPrice = 0;
    this.cart.products.forEach(product => {
      this.totalPrice += product.quantity * this.getRawNumber(product.price); // Tính tổng
    });
    this.stringPrice = this.formatPrice(this.totalPrice); // Định dạng giá trị thành chuỗi với dấu phẩy
  }

  // Định dạng giá trị thành tiền tệ với dấu phẩy
  formatPrice(x: number): string {
    try {
      const parts = x.toString().split(",");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join("."); // Định dạng thành tiền với dấu chấm ngăn cách
    } catch (e) {
      return String(x); // Trả về chuỗi nếu có lỗi
    }
  }

  // Cập nhật giỏ hàng lên server
  updateCart() {
    const extractedProducts = this.cart.products.map(product => ({
      product: product.productID,
      quantity: product.quantity
    }));
    const data = { products: extractedProducts };

    // Gửi dữ liệu giỏ hàng đã thay đổi lên server
    this.cartService.updateCart(this.cart.cartID, data).subscribe(() => {
      this.calculateTotalPrice(); // Tính lại tổng tiền sau khi cập nhật
    });
  }

  // Lấy giỏ hàng từ CartService
  getCart() {
    this.cartService.getUserCart().subscribe(data => {
      this.cart = data;  // Gán giỏ hàng trả về từ API
      this.calculateTotalPrice(); // Tính toán tổng giỏ hàng
    });
  }

  // Chuyển đến trang thanh toán
  checkout() {
    this.router.navigate(['../checkout'], { relativeTo: this.route });
  }

  // Chuyển đến trang thanh toán với modal đóng
  goToPayment() {
    this.closeModal(); // Đóng modal nếu có
    this.router.navigate(['/payment']);
  }

  // Hiển thị hoặc ẩn modal
  show() {
    this.style = this.style === "none" ? "block" : "none";
  }
}
