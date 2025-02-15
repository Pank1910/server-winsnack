import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-read-blog',
  imports: [CommonModule, FormsModule],
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
      image: 'assets/images/articles/tay_ninh_special.jpg',
      category: 'Chuyện kể từ nguyên liệu',
      title: 'Bánh tráng Tây Ninh - đặc sản khó cưỡng',
      comments: '4 luận',
      time: '15 min prep'
    },
    {
      image: 'assets/images/articles/culture_food.jpg',
      category: 'bí quyết ăn vặt ngon miệng',
      title: 'Ẩm thực trong văn hóa - Hơn cả một bữa ăn',
      comments: '10 bình luận',
      time: '45 phút trước'
    }
  ];

  // More Articles
  moreArticles = [
    {
      image: 'assets/images/articles/cheese_roll.jpg',
      title: 'Tự làm bánh tráng cuộn phô mai giòn rụm siêu dễ',
      tags: [
        { icon: 'assets/images/icons/comment.svg', label: '6 Bình luận' },
        { icon: 'assets/images/icons/time.svg', label: '20 phút trước' }
      ]
    },
    {
      image: 'assets/images/articles/dalat_snack.jpg',
      title: 'Hành trình từ những trái cây Đà Lạt đến gói snack chất lượng',
      tags: [
        { icon: 'assets/images/icons/comment.svg', label: '6 Bình luận' },
        { icon: 'assets/images/icons/time.svg', label: '1 ngày trước' }
      ]
    },
    {
      image: 'assets/images/articles/combo_deal.jpg',
      title: 'Khám phá các combo mới với giá ưu đãi siêu hời',
      tags: [
        { icon: 'assets/images/icons/comment.svg', label: '6 Bình luận' },
        { icon: 'assets/images/icons/time.svg', label: '12/01/2025' }
      ]
    }
  ];

}
