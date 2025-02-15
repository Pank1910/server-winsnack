import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './all-blogs.component.html',
  styleUrl: './all-blogs.component.css'
})
export class AllBlogsComponent {
  blogPosts= [
    {
      id: 1,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "20 phút trước",
      title: "Cách làm bánh tráng trộn thơm ngon chuẩn vị Sài Gòn",
    },
    {
      id: 2,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "1 ngày trước",
      title: "Bí mật kết hợp các loại snack để tạo nên bữa ăn vặt hoàn hảo",
    },
    {
      id: 3,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "12/01/2025",
      title: "Những món ăn vặt siêu hấp dẫn khi xem phim hoặc tụ họp bạn bè",
    },
    {
      id: 4,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "20 phút trước",
      title: "Muối tôm Tây Ninh: Hương vị làm nên sự đặc biệt của Win Snack",
    },
    {
      id: 5,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "20 phút trước",
      title: "Tự làm bánh tráng cuộn phô mai giòn rụm siêu dễ",
    },
    {
      id: 6,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "12/01/2025",
      title: "Sáng tạo bữa ăn vặt với combo DIY của Win Snack",
    },
    {
      id: 7,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "20 phút trước",
      title: "Khách hàng nói gì về combo snack đặc biệt của Win Snack?",
    },
    {
      id: 8,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "12/01/2025",
      title: "Câu chuyện thú vị từ khách hàng trung thành của Win Snack",
    },
    {
      id: 9,
      imageUrl: "assets/images/blog/blog2.png",
      commentCount: 6,
      timeAgo: "20 phút trước",
      title: "Ăn vặt lành mạnh: Các món snack ít calo cho bạn giữ dáng",
    },
  ];
}
