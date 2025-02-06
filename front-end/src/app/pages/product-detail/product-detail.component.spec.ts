import { Component } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product = {
    name: 'Bánh tráng rong biển',
    originalPrice: 30000,
    currentPrice: 25000,
    discountPercentage: 15,
    description: 'Bánh tráng rong biển được làm từ bánh tráng mỏng giòn, kết hợp với rong biển sấy khô, mè ngang và gia vị đậm đà. Mời bạn thưởng thức.',
    variants: [{ weight: '200g' }],
    images: [
      'assets/images/products/banh-trang-rong-bien.png',
      'assets/images/products/banh-trang-rong-bien.png',
      'assets/images/products/banh-trang-rong-bien.png',
      'assets/images/products/banh-trang-rong-bien.png'
    ]
  };

  relatedProducts = [
    { 
      name: 'Bánh tráng trộn mè chua', 
      price: 35000, 
      discount: 30,
      image: 'assets/images/products/banh-trang-rong-bien.png'
    },
    { 
      name: 'Bánh tráng rong rong mè nang', 
      price: 25000, 
      discount: 15,
      image: 'assets/images/products/banh-trang-rong-bien.png'
    },
    { 
      name: 'Bánh tráng trộn chả bông', 
      price: 25000, 
      discount: 15,
      image: 'assets/images/products/banh-trang-rong-bien.png'
    },
    { 
      name: 'Bánh tráng phô mai bơ', 
      price: 25000, 
      discount: 15,
      image: 'assets/images/products/banh-trang-rong-bien.png'
    }
  ];

  quantity = 1;

  updateQuantity(change: number) {
    this.quantity = Math.max(1, this.quantity + change);
  }

  addToCart() {
    console.log('Added to cart');
  }
}
