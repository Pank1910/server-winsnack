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
  products: Product[] = [];
  categories: { name: string, count: number, image: string }[] = [];
  filteredCategories: { name: string, count: number, image: string }[] = [];
  searchText: string = '';
  selectedCategory: string = 'all-categories';

  constructor(private router: Router, private productApiService: ProductApiService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  /** 🔥 Lấy danh sách sản phẩm từ API & nhóm theo danh mục */
  fetchProducts() {
    this.productApiService.getAllProducts().subscribe(
      (response) => {
        console.log('API Data:', response); 
        if (response.success) {
          this.products = response.data;
          this.groupByCategory();
        }
      },
      (error) => {
        console.error('Error loading product list:', error);
      }
    );
  }

  /** 🔥 Nhóm sản phẩm theo danh mục & đếm số lượng */
  groupByCategory() {
    const categoryMap = new Map<string, { count: number, image: string }>();

    this.products.forEach(product => {
      const categoryName = product.product_dept;  // ✅ Lấy danh mục từ API
      const imageUrl = product.image_1;  // ✅ Dùng ảnh đầu tiên làm đại diện

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { count: 1, image: imageUrl });
      } else {
        categoryMap.get(categoryName)!.count++;
      }
    });

    // ✅ Chuyển Map thành mảng danh mục có số lượng sản phẩm
    this.categories = Array.from(categoryMap, ([name, data]) => ({
      name, count: data.count, image: data.image
    }));

    this.filteredCategories = [...this.categories];
    console.log('List of categories after processing:', this.categories);
  }

  /** 🔥 Gọi API để xóa danh mục */
  deleteCategory(categoryName: string) {
    if (confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
      this.productApiService.deleteCategory(categoryName).subscribe({
        next: (response) => {
          console.log(`Category "${categoryName}" has been removed from the API`, response);
          this.fetchProducts(); // ✅ Tải lại danh mục sau khi xóa
        },
        error: (error) => {
          console.error('Error while deleting category:', error);
        }
      });
    }
  }

  onSearchChange(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.filterCategories();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterCategories();
  }

  /** 🔥 Lọc danh mục theo tìm kiếm */
  filterCategories() {
    let tempCategories = [...this.categories];

    if (this.selectedCategory !== 'all-categories') {
      tempCategories = tempCategories.filter(cat => cat.name === this.selectedCategory);
    }

    if (this.searchText.trim() !== '') {
      tempCategories = tempCategories.filter(cat =>
        cat.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredCategories = tempCategories;
    console.log('List after filtering:', this.filteredCategories);
  }
}
