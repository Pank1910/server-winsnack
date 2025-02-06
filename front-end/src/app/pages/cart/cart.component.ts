import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = {
    items: [
      {
        productId: 1,
        productName: 'Product Name',
        productImage: 'image.jpg',
        price: 100000,
        quantity: 1
      }
      // Add more products as needed
    ]
  };

  constructor() { }

  ngOnInit(): void {
    // Optionally, fetch cart data from a service or localStorage
  }

  // Function to increase quantity
  onAddQuantity(item: any): void {
    item.quantity++;
    this.updateCart();
  }

  // Function to decrease quantity
  onRemoveQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  // Function to remove item from cart
  onRemoveFromCart(item: any): void {
    const index = this.cart.items.indexOf(item);
    if (index !== -1) {
      this.cart.items.splice(index, 1);
      this.updateCart();
    }
  }

  // Function to update cart (e.g., store the updated cart)
  updateCart(): void {
    // Logic to update the cart, e.g., calling a service or saving to localStorage
    console.log("Cart updated", this.cart.items);
  }

  // Function to calculate total price
  getTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Function to navigate to checkout
  navigateToCheckout(): void {
    // Logic to navigate to checkout page, e.g., using Angular Router
    console.log('Navigating to checkout');
  }

  // Function to continue shopping
  continueShopping(): void {
    // Navigate to products page or perform other actions
    console.log('Continuing shopping');
  }
}