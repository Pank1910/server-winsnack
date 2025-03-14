import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { ProductApiService } from '../../product-api.service';
import { HttpClient } from '@angular/common/http'; // ✅ Import HttpClient để tránh lỗi

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: []
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductApiService, private router: Router, private http: HttpClient) {} // ✅ Thêm HttpClient vào constructor

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getAllProducts().subscribe({
      next: (response) => {
        console.log("Dữ liệu API trả về:", response); // Kiểm tra dữ liệu có đến FE không
        this.products = response.data;
        this.filteredProducts = this.products;
        this.loading = false;
      },
      error: (err) => {
        console.error("Lỗi API:", err);
        this.loading = false;
      }
    });
  }

  addProduct(): void {
    console.log('Thêm sản phẩm mới');
  }

  editProduct(id: string): void {
    console.log(`Chỉnh sửa sản phẩm: ${id}`);
    this.router.navigate(['/update-product', id]);
  }

  /** 🔥 Xóa sản phẩm qua API */
  deleteProduct(id: string): void {
    if (confirm('❗ Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.http.delete(`http://localhost:5000/products/${id}`).subscribe({
        next: () => {
          // ✅ Xóa sản phẩm khỏi danh sách hiển thị
          this.products = this.products.filter(product => product._id !== id);
          this.filteredProducts = [...this.products];
          console.log(`✅ Đã xóa sản phẩm có ID: ${id}`);
        },
        error: (err) => {
          console.error('❌ Lỗi khi xóa sản phẩm:', err);
        }
      });
    }
  }

  viewProduct(id: string): void {
    console.log(`Xem chi tiết sản phẩm: ${id}`);
    this.router.navigate(['/product-detail', id]);
  }

  searchProduct(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.product_name.toLowerCase().includes(searchValue) ||
      product.product_dept.toLowerCase().includes(searchValue)
    );
  }
}
