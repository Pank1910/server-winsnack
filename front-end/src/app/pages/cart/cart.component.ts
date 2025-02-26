
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalSelectedPrice: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.updateTotalSelectedPrice();
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.stocked_quantity) {
      item.quantity += 1;
      this.updateTotalSelectedPrice();
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateTotalSelectedPrice();
    }
  }

  saveChanges(productId: string | null): void {
    if (productId) {
      const item = this.cartItems.find((item) => item.productId === productId);
      if (item) {
        this.cartService.updateQuantity(productId, item.quantity).subscribe(() => {
          alert('Sản phẩm đã được lưu thành công.');
          this.loadCartItems();
        });
      }
    }
  }

  updateTotalSelectedPrice(): void {
    this.totalSelectedPrice = this.cartItems.reduce((total, item) => total + item.unit_price * item.quantity, 0);
  }

  proceedToCheckout(): void {
    this.cartService.saveSelectedItems(this.cartItems).subscribe(() => {
      this.router.navigate(['/payment']);
    });
  }

  removeFromCart(productId: string | null): void {
    if (productId) {
      this.cartService.removeFromCart(productId).subscribe(() => {
        this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
        this.updateTotalSelectedPrice();
      });
    }
  }

  // Thêm phương thức 'confirmRemoveFromCart'
  confirmRemoveFromCart(productId: string | null): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      this.removeFromCart(productId);
    }
  }

  // Thêm phương thức 'continueShopping'
  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  // Thêm phương thức 'updateCart'
  updateCart(): void {
    this.cartService.updateCartItems(this.cartItems).subscribe(() => {
      alert('Giỏ hàng đã được cập nhật');
      this.loadCartItems();
    });
  }
}
