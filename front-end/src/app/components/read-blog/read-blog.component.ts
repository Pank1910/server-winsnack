import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-read-blog',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './read-blog.component.html',
  styleUrl: './read-blog.component.css'
})
export class ReadBlogComponent {
  // Header Section
  blogTitle = `CÁCH LÀM<br>BÁNH TRÁNG TRỘN<br>"CHUẨN VỊ" SÌ GÒN`;
  author = 'Win Snack';
  publishDate = '24 - 1 - 2024';
  
  // Main Content
  blogContent = `
  Bạn đã sẵn sàng tự tay làm bánh tráng trộn thơm ngon 'chuẩn nhà làm' chưa? Món ăn vặt thần thánh này sẽ ngon hơn nếu bạn tự chế biến, vừa vệ sinh lại hợp khẩu vị! Bắt đầu thôi nào!
  <br><br>
  <span class="font-bold">Bước 1: Sơ chế nguyên liệu</span>
  <br>
  Trứng cút: Nhẹ tay thả trứng vào nồi, luộc khoảng 10 phút...`;

  // Related Articles
  relatedArticles = [
    {
      blogid: 2,
      title: 'Bí mật kết hợp các loại snack để tạo nên bữa ăn vặt hoàn hảo',
      category: 'Chuyện kể từ nguyên liệu',
      content: 'Bánh tráng chấm với nhiều loại sốt...',
      image: 'assets/images/blog/blog3.png',
      abstract: 'Món ăn vặt phổ biến trong giới trẻ...',
      time: "2025-02-12",
      comments: 3,
    },
    {
      blogid: 3,
      title: 'Những món ăn vặt siêu hấp dẫn khi xem phim hoặc tụ họp bạn bè',
      category: 'bí quyết ăn vặt ngon miệng',
      content: 'Bánh ngọt mềm mịn, thơm lừng...',
      image: 'assets/images/blog/blog4.png',
      abstract: 'Bánh ngọt hấp dẫn với nhiều hương vị...',
      time: "2025-03-08",
      comments: 3,
    }
  ];

  // More Articles
  moreArticles = [
      {
          image: 'assets/images/blog/blog2.png',
          title: 'Cách làm bánh tráng trộn thơm ngon chuẩn vị Sài Gòn',
          comment: '3 Bình luận',
          time: '08/03/2025'
      },
      {
          image: 'assets/images/blog/blog3.png',
          title: 'Bí mật kết hợp các loại snack để tạo nên bữa ăn vặt hoàn hảo',
          comment: '3 Bình luận',
          time: '01/02/2025'
      },
      {
          image: 'assets/images/blog/blog4.png',
          title: 'Những món ăn vặt siêu hấp dẫn khi xem phim hoặc tụ họp bạn bè',
          comment: '3 Bình luận',
          time: '24/02/2025'
      }]
    }
