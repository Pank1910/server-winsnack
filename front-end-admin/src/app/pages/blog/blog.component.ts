import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true, // Nếu bạn dùng standalone component, cần bật dòng này
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  blogPosts = [
    { id: 'bt1211', date: '26/02/24', category: 'Bí quyết ăn vặt ngon miệng', title: 'Cách làm bánh tráng trộn thơm ngon chuẩn vị Sài Gòn', isVisible: true },
    { id: 'bt1212', date: '26/02/24', category: 'Chuyện kể từ nguyên liệu', title: 'Muối tôm Tây Ninh: Hương vị làm nên sự đặc biệt của Win Snack', isVisible: true },
    { id: 'bt1213', date: '26/02/24', category: 'Công thức DIY', title: 'Tự làm bánh tráng cuộn phô mai giòn rụm siêu dễ', isVisible: false },
    { id: 'bt1214', date: '26/02/24', category: 'Góc sức khỏe và dinh dưỡng', title: 'Ăn vặt lành mạnh: Các món snack ít calo cho bạn giữ dáng', isVisible: true },
    { id: 'bt1215', date: '26/02/24', category: 'Đánh giá và feedback khách hàng', title: 'Khách hàng nói gì về combo snack đặc biệt của Win Snack?', isVisible: false },
  ];
  
  filteredPosts: any[] = [];
  searchText: string = '';
  selectedCategory: string = 'all-posts';
  
  ngOnInit() {
    // Khởi tạo danh sách bài viết khi component được load
    this.filterPosts();
  }
  
  toggleVisibility(postId: string) {
    const post = this.blogPosts.find(post => post.id === postId);
    if (post) {
      post.isVisible = !post.isVisible;
      console.log(`Trạng thái hiển thị của bài viết "${post.title}":`, post.isVisible);
    }
  }
  
  addPost() {
    console.log('Thêm bài viết mới');
  }
  
  editPost(id: string) {
    console.log(`Chỉnh sửa bài viết: ${id}`);
  }
  
  deletePost(id: string) {
    this.blogPosts = this.blogPosts.filter(post => post.id !== id);
    this.filterPosts();
    console.log(`Xóa bài viết: ${id}`);
  }
  
  viewPost(id: string) {
    console.log(`Xem chi tiết bài viết: ${id}`);
  }
  
  onSearchChange(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.filterPosts();
  }
  
  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterPosts();
  }
  
  filterPosts() {
    // Lọc theo danh mục
    let tempPosts = [...this.blogPosts];
    
    if (this.selectedCategory !== 'all-posts') {
      tempPosts = tempPosts.filter(post => 
        post.category === this.getCategoryNameFromValue(this.selectedCategory)
      );
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (this.searchText) {
      tempPosts = tempPosts.filter(post =>
        post.title.toLowerCase().includes(this.searchText) ||
        post.category.toLowerCase().includes(this.searchText) ||
        post.id.toLowerCase().includes(this.searchText)
      );
    }
    
    this.filteredPosts = tempPosts;
  }
  
  // Hàm để lấy tên danh mục từ giá trị option
  getCategoryNameFromValue(value: string): string {
    switch(value) {
      case 'category-4': return 'Bí quyết ăn vặt ngon miệng';
      case 'category-3': return 'Chuyện kể từ nguyên liệu';
      case 'category-5': return 'Công thức DIY';
      case 'category-1': return 'Góc sức khỏe và dinh dưỡng';
      case 'category-2': return 'Đánh giá và feedback khách hàng';
      default: return '';
    }
  }
}