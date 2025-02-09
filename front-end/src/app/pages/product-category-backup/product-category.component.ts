import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent {

  // Các biến để lưu giá trị của thanh trượt và ô nhập liệu
  minPrice: number = 0;
  maxPrice: number = 250000;

  // Hàm cập nhật giá trị khi thay đổi thanh trượt hoặc ô nhập liệu
  onPriceChange() {
    // Đảm bảo minPrice không lớn hơn maxPrice
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice;
    }
  }

  // Hàm để reset bộ lọc
  resetFilter() {
    this.minPrice = 0;
    this.maxPrice = 250000;
  }
}
