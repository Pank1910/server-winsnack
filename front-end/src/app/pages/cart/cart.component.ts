import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  productID: string;
  title: string;
  price: number;
  quantity: number;
  imgbase64_reduce: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products: Product[] = [ // Sample data
    {
      productID: '1',
      title: 'Bánh tráng trộn',
      price: 20000,
      quantity: 2,
      imgbase64_reduce: 'https://via.placeholder.com/150'
    },
    {
      productID: '2',
      title: 'Snack khoai tây',
      price: 30000,
      quantity: 1,
      imgbase64_reduce: 'https://via.placeholder.com/150'
    }
  ];
  
  constructor(private router: Router) {}

  ngOnInit() {
    this.calculateTotalPrice(); // Calculate total price on page load
  }

  // Increase product quantity
  increaseQuantity(productID: string) {
    const product = this.products.find(p => p.productID === productID);
    if (product) {
      product.quantity++;
      this.calculateTotalPrice();
    }
  }

  // Decrease product quantity
  decreaseQuantity(productID: string) {
    const product = this.products.find(p => p.productID === productID);
    if (product && product.quantity > 1) {
      product.quantity--;
      this.calculateTotalPrice();
    }
  }

  // Calculate the total price of the cart
  calculateTotalPrice() {
    const totalPrice = this.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    return totalPrice;
  }

  // Format price to VND currency format
  formatPrice(x: number): string {
    return x.toLocaleString('vi-VN') + ' VND';
  }

  // Navigate to checkout page
  checkout() {
    this.router.navigate(['/checkout']);
  }

  // Remove product from cart
  onRemoveFromCart(product: Product) {
    this.products = this.products.filter(p => p.productID !== product.productID);
    this.calculateTotalPrice();
  }

  // Continue shopping
  continueShopping() {
    this.router.navigate(['/products']);
  }

  // Update cart (if any quantity changes)
  updateCart() {
    this.calculateTotalPrice();
  }

  // Navigate to checkout
  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
