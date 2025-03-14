import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../../../../my-server-mongodb/interface/Cart';
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
  cartItems: (CartItem & { isSelected: boolean; tempQuantity: number; product_name: string; image_1: string; stocked_quantity: number })[] = [];
  totalSelectedPrice: number = 0;
  recommendedProducts: RecommendedProduct[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(
      (items) => {
        console.log('Cart items received in component:', items);
        this.cartItems = items ? items.map((item) => ({
          ...item,
          product_name: item.product_name ?? 'Tên sản phẩm',
          image_1: item.image_1 ?? 'default-image.jpg',
          stocked_quantity: item.stocked_quantity ?? 0,
          isSelected: item.isSelected ?? true,
          tempQuantity: item.tempQuantity ?? item.quantity,
        })) : [];
        this.updateTotalSelectedPrice();
      },
      (error) => {
        console.error('Error subscribing to cartItems$:', error);
      }
    );
    this.cartService.getRecommendedProducts().subscribe(products => {
      this.recommendedProducts = products;
    });
    this.cartService.loadCartFromDatabase();
  }

  toggleSelectAll(): void {
    const allSelected = this.cartItems.every((item) => item.isSelected);
    this.cartItems.forEach((item) => (item.isSelected = !allSelected));
    this.updateTotalSelectedPrice();
  }

  onItemSelectChange(): void {
    this.updateTotalSelectedPrice();
  }

  increaseQuantity(item: CartItem & { isSelected: boolean; tempQuantity: number; stocked_quantity: number }): void {
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
      item.tempQuantity = Math.min(Math.max(quantity, 1), item.stocked_quantity);
      this.updateTotalSelectedPrice();
    }
  }

  saveChanges(productId?: string | null): void {
    if (productId) {
      const item = this.cartItems.find((item) => item.productId === productId);
      if (item) {
        this.cartService.updateQuantity(productId, item.tempQuantity).subscribe({
          next: () => alert('Sản phẩm đã được lưu thành công.'),
          error: (err) => alert('Lỗi khi lưu sản phẩm: ' + err.message)
        });
      }
    } else {
      this.cartService.updateCartItems(this.cartItems).subscribe({
        next: () => alert('Giỏ hàng đã được cập nhật.'),
        error: (err) => alert('Lỗi khi cập nhật giỏ hàng: ' + err.message)
      });
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
      // Chuyển hướng sang trang /payment mà không gọi saveSelectedItems
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

  private removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.updateTotalSelectedPrice(),
      error: (err) => alert('Lỗi khi xóa sản phẩm: ' + err.message)
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  updateCart(): void {
    this.saveChanges();
  }
}