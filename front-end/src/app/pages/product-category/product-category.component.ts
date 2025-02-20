import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-category.component.html',
})
export class ProductCategoryComponent {
  minPrice: number = 0;
  maxPrice: number = 250000;

  categories: string[] = [
    "Bánh tráng trộn sẵn",
    "Bánh tráng nướng",
    "Bánh tráng ngọt",
    "Combo bánh tráng mix vị",
    "Nguyên liệu ăn vặt"
  ];

  products = [
    { name: "Bánh tráng chà bông", image: "/assets/images/product-category/Chabong.png", rating: 5.0, reviews: 100, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", oldPrice: 30000, newPrice: 25000, discount: 30 },
    { name: "Bánh tráng rong biển", image: "/assets/images/product-category/Rongbien.png", rating: 5.0, reviews: 100, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", oldPrice: 30000, newPrice: 25000, discount: 30 },
    { name: "Bánh tráng sốt bơ", image: "/assets/images/product-category/Bo.png", rating: 5.0, reviews: 100, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", oldPrice: 30000, newPrice: 25000, discount: 30 },
    { name: "Bánh tráng nướng gà cay", image: "/assets/images/product-category/Ga.png", rating: 4.9, reviews: 10, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", oldPrice: 70000, newPrice: 40000, discount: 30 },
    { name: "Xoài chín sấy khô", image: "/assets/images/product-category/Xoai.png", rating: 4.9, reviews: 10, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", oldPrice: 90000, newPrice: 65000, discount: 30 },
    { name: "Bánh tráng nướng sầu riêng", image: "/assets/images/product-category/Saurieng.png", rating: 4.9, reviews: 45, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", newPrice: 55000 },
    { name: "Bánh tráng gạo lứt", image: "/assets/images/product-category/Gaoluc.png", rating: 4.8, reviews: 20, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", oldPrice: 110000, newPrice: 75000, discount: 30 },
    { name: "Bánh tráng phơi sương", image: "/assets/images/product-category/Phoisuong.png", rating: 4.9, reviews: 100, description: "Bánh tráng phơi sương, xoài sấy, gia vị...", oldPrice: 75000, newPrice: 50000, discount: 30 },
    { name: "Trà xanh chanh dây", image: "/assets/images/product-category/Chanhday.png", rating: 4.8, reviews: 30, description: "Thơm ngon, giải khát...", newPrice: 95000 }
  ];

  filteredProducts() {
    return this.products.filter(product => product.newPrice >= this.minPrice && product.newPrice <= this.maxPrice);
  }

  onPriceChange() {
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice;
    }
  }

  resetFilter() {
    this.minPrice = 0;
    this.maxPrice = 250000;
  }

  formatPrice(value: number): string {
    return value.toLocaleString("vi-VN");
  }
}
