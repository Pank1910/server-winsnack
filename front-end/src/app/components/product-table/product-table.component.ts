import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Product } from '../../../interface/Product';
import { ProductService } from './product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getAllProducts()
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
          this.loading = false;
          console.error('Failed to load products:', err);
        }
      });
  }

  refreshData(): void {
    this.loadProducts();
  }

  getStars(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }
}