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
  cart: Cart = { items: [] };
  recommendedProducts = [
    { name: 'Bánh tráng rong biển', price: 25000, image: 'assets/products/product1.jpg' },
    { name: 'Bánh tráng sốt bơ', price: 25000, image: 'assets/products/product2.jpg' },
    { name: 'Bánh tráng chà bông', price: 25000, image: 'assets/products/product3.jpg' },
    { name: 'Bánh tráng muối nhuyễn', price: 25000, image: 'assets/products/product4.jpg' },
    { name: 'Bánh tráng phô mai', price: 25000, image: 'assets/products/product5.jpg' },
  ];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
    });
  }

  getTotal(): number {
    return this.cart.items
      .map((item) => item.price * item.quantity)
      .reduce((acc, value) => acc + value, 0);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  updateCart(): void {
    this.cartService.updateCart(this.cart.items);
  }

  navigateToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
