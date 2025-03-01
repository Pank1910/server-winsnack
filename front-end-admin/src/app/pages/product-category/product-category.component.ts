import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
  isVisible: boolean;
}

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})

export class ProductCategoryComponent implements OnInit {
  
  categories= [
    {
      id: "BTT",
      name: "Bánh tráng trộn sẵn",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/abe7d59de9f49fe6bc26ce4fe8f9e966c7b81ca5f820e4a4744cdcbf8a76ddb4?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 9,
      isVisible: true,
    },
    {
      id: "BTN",
      name: "Bánh tráng nướng",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/abe7d59de9f49fe6bc26ce4fe8f9e966c7b81ca5f820e4a4744cdcbf8a76ddb4?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 3,
      isVisible: true,
    },
    {
      id: "BTNG",
      name: "Bánh tráng ngọt",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/abe7d59de9f49fe6bc26ce4fe8f9e966c7b81ca5f820e4a4744cdcbf8a76ddb4?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 5,
      isVisible: true,
    },
    {
      id: "CB",
      name: "Combo bánh tráng mix gia vị",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/abe7d59de9f49fe6bc26ce4fe8f9e966c7b81ca5f820e4a4744cdcbf8a76ddb4?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 10,
      isVisible: true,
    },
    {
      id: "NL",
      name: "Nguyên liệu lẻ",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/abe7d59de9f49fe6bc26ce4fe8f9e966c7b81ca5f820e4a4744cdcbf8a76ddb4?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 10,
      isVisible: true,
    },
  ];
  filteredCategories: Category[] = [];
  searchText: string = '';
  selectedCategory: string = 'all-categories';
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Khởi tạo filteredCategories bằng categories
    this.filteredCategories = [...this.categories];
  }
  
  toggleVisibility(categoryId: string) {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.isVisible = !category.isVisible;
      console.log(`Trạng thái hiển thị của ${category.name}:`, category.isVisible);
    }
  }
  
  addCategory() {
    this.router.navigate(['/add-category']);
  }
  
  editCategory(id: string) {
    this.router.navigate(['/update-category', id]);
  }
  
  deleteCategory(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categories = this.categories.filter(category => category.id !== id);
      this.filterCategories();
      console.log(`Xóa danh mục: ${id}`);
    }
  }
  
  viewCategory(id: string) {
    console.log(`Xem chi tiết danh mục: ${id}`);
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
    // Bắt đầu với toàn bộ danh mục
    let tempCategories = [...this.categories];
    
    // Lọc theo danh mục đã chọn
    if (this.selectedCategory !== 'all-categories') {
      tempCategories = tempCategories.filter(category => 
        category.id === this.selectedCategory
      );
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (this.searchText && this.searchText.trim() !== '') {
      tempCategories = tempCategories.filter(category =>
        category.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        category.id.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    this.filteredCategories = tempCategories;
  }
}