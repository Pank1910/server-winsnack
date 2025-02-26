import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogPosts= [
    { id: 'bt1211', date: '26/02/24', category: 'Bí quyết ăn vặt ngon miệng', title: 'Cách làm bánh tráng trộn thơm ngon chuẩn vị Sài Gòn', isVisible: true },
    { id: 'bt1211', date: '26/02/24', category: 'Chuyện kể từ nguyên liệu', title: 'Muối tôm Tây Ninh: Hương vị làm nên sự đặc biệt của Win Snack', isVisible: true },
    { id: 'bt1211', date: '26/02/24', category: 'Công thức DIY', title: 'Tự làm bánh tráng cuộn phô mai giòn rụm siêu dễ', isVisible: false },
    { id: 'bt1211', date: '26/02/24', category: 'Góc sức khỏe và dinh dưỡng', title: 'Ăn vặt lành mạnh: Các món snack ít calo cho bạn giữ dáng', isVisible: true },
    { id: 'bt1211', date: '26/02/24', category: 'Đánh giá và feedback khách hàng', title: 'Khách hàng nói gì về combo snack đặc biệt của Win Snack?', isVisible: false },
  ];
  toggleVisibility(postId: string) {
    const post = this.blogPosts.find(post => post.id === postId);
    if (post) {
      post.isVisible = !post.isVisible;
      console.log(`Trạng thái hiển thị của bài viết "${post.title}":`, post.isVisible);
    }
  }  
}
