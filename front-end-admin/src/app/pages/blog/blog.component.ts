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
    { id: 'bt1211', date: '26/02/24', category: 'Delicious snack tips', title: 'How to make delicious mixed rice paper with Saigon flavor', isVisible: true },
    { id: 'bt1212', date: '26/02/24', category: 'Story from raw materials', title: 'Tay Ninh Shrimp Salt: The flavor that makes Win Snack special', isVisible: true },
    { id: 'bt1213', date: '26/02/24', category: 'DIY Recipe', title: 'Make your own crispy cheese rolls super easy', isVisible: false },
    { id: 'bt1214', date: '26/02/24', category: 'Health and nutrition', title: 'Healthy Snacking: Low-Calorie Snacks to Keep You Slim', isVisible: true },
    { id: 'bt1215', date: '26/02/24', category: 'Customer reviews and feedback', title: 'What do customers say about our special snack combo of Win Snack?', isVisible: false },
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
      console.log(`Post visibility status "${post.title}":`, post.isVisible);
    }
  }
  
  addPost() {
    console.log('Add new post');
  }
  
  editPost(id: string) {
    console.log(`Edit post: ${id}`);
  }
  
  deletePost(id: string) {
    this.blogPosts = this.blogPosts.filter(post => post.id !== id);
    this.filterPosts();
    console.log(`Delete post: ${id}`);
  }
  
  viewPost(id: string) {
    console.log(`See post details: ${id}`);
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
      case 'category-4': return 'Delicious snack tips';
      case 'category-3': return 'Story from raw materials';
      case 'category-5': return 'DIY Recipe';
      case 'category-1': return 'Health and nutrition';
      case 'category-2': return 'Customer reviews and feedback';
      default: return '';
    }
  }
}