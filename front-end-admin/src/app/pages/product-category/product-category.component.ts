import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../product-api.service';
import { Product } from '../../../../../my-server-mongodb/interface/Product';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  products: Product[] = []; categories: Product[] = [];
  filteredCategories: Product[] = [];
  searchText: string = '';
  selectedCategory: string = 'all-categories';

  constructor(private router: Router, private productApiService: ProductApiService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  /** Lấy danh sách sản phẩm từ API */
  fetchProducts() {
    this.productApiService.getAllProducts().subscribe(
      (response) => {
        console.log('Dữ liệu API:', response); // ✅ Kiểm tra dữ liệu API
        if (response.success) {
          this.products = response.data;
          this.filteredCategories = [...this.products];
          console.log('Dữ liệu sau khi gán:', this.filteredCategories);
        }
      },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
      }
    );
  }

  toggleVisibility(productId: string) {
    const product = this.products.find(p => p._id === productId);
    if (product) {
      product.isNew = !product.isNew;
      console.log(`Trạng thái sản phẩm mới của ${product.product_name}:`, product.isNew);
    }
  }

  addProduct() {
    this.router.navigate(['/add-product']);
  }

  editProduct(id: string) {
    this.router.navigate(['/update-product', id]);
  }

  deleteCategory(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.products = this.products.filter(product => product._id !== id);
      this.filterCategories();
      console.log(`Xóa danh mục: ${id}`);
    }
  }

  viewProduct(id: string) {
    console.log(`Xem chi tiết sản phẩm: ${id}`);
  }

  onSearchChange(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.filterCategories();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterCategories();
  }

  filterCategories() {
    let tempProducts = [...this.products];

    if (this.selectedCategory !== 'all-categories') {
      tempProducts = tempProducts.filter(product => 
        product.product_dept === this.selectedCategory
      );
    }

    if (this.searchText && this.searchText.trim() !== '') {
      tempProducts = tempProducts.filter(product =>
        product.product_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product._id.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredCategories = tempProducts;
    console.log('Dữ liệu sau khi lọc:', this.filteredCategories);
  }
}
