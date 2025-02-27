import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../../interface/Cart';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


interface RecommendedProduct {
  productId: string;
  title: string;
  price: number;
  imgbase64_reduce: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: (CartItem & { isSelected: boolean; tempQuantity: number })[] = [];
  totalSelectedPrice: number = 0;
  recommendedProducts: RecommendedProduct[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Sử dụng cartItems$ thay vì getCartItems()
    this.cartService.cartItems$.subscribe(
      (items: (CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[]) => {
        this.cartItems = items.map((item) => ({
          ...item,
          isSelected: item.isSelected ?? true,
          tempQuantity: item.tempQuantity ?? item.quantity,
        }));
        this.updateTotalSelectedPrice();
      }
    );

    // Giả lập getRecommendedProducts nếu chưa có trong CartService
    this.loadRecommendedProducts();
  }

  private loadRecommendedProducts(): void {
    // Nếu CartService chưa có getRecommendedProducts, dùng dữ liệu giả
    this.recommendedProducts = [
      { productId: '1', title: 'Snack A', price: 20000, imgbase64_reduce: 'assets/snack-a.png' },
      { productId: '2', title: 'Snack B', price: 15000, imgbase64_reduce: 'assets/snack-b.png' },
    ];
  }

  toggleSelectAll(): void {
    const allSelected = this.cartItems.every((item) => item.isSelected);
    this.cartItems.forEach((item) => (item.isSelected = !allSelected));
    this.updateTotalSelectedPrice();
  }

  onItemSelectChange(): void {
    this.updateTotalSelectedPrice();
  }

  increaseQuantity(item: CartItem & { isSelected: boolean; tempQuantity: number }): void {
    if (item.tempQuantity < item.stocked_quantity) {
      item.tempQuantity += 1;
      this.updateTotalSelectedPrice();
    }
  }

  decreaseQuantity(item: CartItem & { isSelected: boolean; tempQuantity: number }): void {
    if (item.tempQuantity > 1) {
      item.tempQuantity -= 1;
      this.updateTotalSelectedPrice();
    }
  }

  updateTempQuantity(productId: string | null, quantity: number): void {
    if (!productId) return;
    const item = this.cartItems.find((item) => item.productId === productId);
    if (item) {
      item.tempQuantity = Math.min(Math.max(quantity, 1), item.stocked_quantity || 0);
      this.updateTotalSelectedPrice();
    }
  }

  saveChanges(productId?: string | null): void {
    if (productId) {
      const item = this.cartItems.find((item) => item.productId === productId);
      if (item) {
        // Giả lập cập nhật quantity, thay bằng gọi service thực tế
        item.quantity = item.tempQuantity;
        alert('Sản phẩm đã được lưu thành công.');
      }
    } else {
      // Giả lập cập nhật toàn bộ giỏ hàng
      this.cartItems.forEach(item => item.quantity = item.tempQuantity);
      alert('Giỏ hàng đã được cập nhật.');
    }
  }

  updateTotalSelectedPrice(): void {
    this.totalSelectedPrice = this.cartItems
      .filter((item) => item.isSelected)
      .reduce((total, item) => total + item.unit_price * item.tempQuantity, 0);
  }

  proceedToCheckout(): void {
    const selectedItemsList = this.cartItems.filter((item) => item.isSelected);
    if (selectedItemsList.length > 0) {
      // Giả lập lưu selected items, thay bằng gọi service thực tế
      console.log('Selected items:', selectedItemsList);
      this.router.navigate(['/payment']);
    } else {
      alert('Vui lòng tick chọn ít nhất một sản phẩm để thanh toán.');
    }
  }

  confirmRemoveFromCart(productId: string | null): void {
    if (!productId) return;
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      this.removeFromCart(productId);
    }
  }

  private removeFromCart(productId: string | null): void {
    if (!productId) return;
    // Giả lập xóa, thay bằng gọi service thực tế
    this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
    this.updateTotalSelectedPrice();
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  updateCart(): void {
    this.saveChanges();
  }
}