import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';
  private cartSubject = new BehaviorSubject<Cart>({ items: [] });
  cart = this.cartSubject.asObservable();

  constructor(private _snackBar: MatSnackBar) {
    // Retrieve cart data from local storage on service initialization
    const storedCart = localStorage.getItem(this.cartKey);
    if (storedCart) {
      this.cartSubject.next(JSON.parse(storedCart));
    }
  }

  private saveCartToLocalStorage(cart: Cart): void {
    // Save cart data to local storage
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  addToCart(item: CartItem): void {
    const cart = this.cartSubject.value;
    const items = [...cart.items];

    const itemInCart = items.find((_item) => _item.sku === item.sku);

    if (itemInCart) {
      itemInCart.quantity += item.quantity || 1; // Default to 1 if no quantity specified
    } else {
      items.push({ ...item, quantity: item.quantity || 1 });
    }

    this.cartSubject.next({ items });
    this.saveCartToLocalStorage({ items });
    this._snackBar.open('Sản phẩm đã được thêm vào giỏ hàng.', 'Đóng', { duration: 3000 });
  }

  getTotal(): number {
    return this.cartSubject.value.items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cartSubject.next({ items: [] });
    this.saveCartToLocalStorage({ items: [] });
    this._snackBar.open('Giỏ hàng đã được làm trống.', 'Đóng', { duration: 3000 });
  }

  removeFromCart(item: CartItem): void {
    const cart = this.cartSubject.value;
    const filteredItems = cart.items.filter((_item) => _item.sku !== item.sku);

    this.cartSubject.next({ items: filteredItems });
    this.saveCartToLocalStorage({ items: filteredItems });
    this._snackBar.open('Sản phẩm đã được xóa khỏi giỏ hàng.', 'Đóng', { duration: 3000 });
  }

  removeQuantity(item: CartItem): void {
    const cart = this.cartSubject.value;
    let itemForRemoval: CartItem | undefined;

    const updatedItems = cart.items.map((_item) => {
      if (_item.sku === item.sku) {
        _item.quantity--;

        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });

    let finalItems = updatedItems;

    if (itemForRemoval) {
      finalItems = updatedItems.filter((_item) => _item.sku !== itemForRemoval!.sku);
    }

    this.cartSubject.next({ items: finalItems });
    this.saveCartToLocalStorage({ items: finalItems });
    this._snackBar.open('Số lượng sản phẩm đã được cập nhật.', 'Đóng', { duration: 3000 });
  }

  updateCart(items: CartItem[]): void {
    this.cartSubject.next({ items });
    this.saveCartToLocalStorage({ items });
    this._snackBar.open('Giỏ hàng đã được cập nhật.', 'Đóng', { duration: 3000 });
  }

  getCart(): Observable<Cart> {
    return this.cart;
  }
}
