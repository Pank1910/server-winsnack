import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog-category.component.html',
  styleUrl: './blog-category.component.css'
})
export class BlogCategoryComponent {

  blogCategory = [
    {
      blogid: 1,
      title: 'Cách làm bánh tráng trộn thơm ngon chuẩn vị Sài Gòn',
      content: 'Món ăn vặt đặc sản Nha Trang...',
      images: 'assets/images/blog/blog2.png',
      abstract: 'Bánh tráng xoài dẻo, thơm ngon...',
      post_date: new Date('2024-02-14'),
      comments: 3,
    },
    {
      blogid: 2,
      title: 'Bí mật kết hợp các loại snack để tạo nên bữa ăn vặt hoàn hảo',
      content: 'Bánh tráng chấm với nhiều loại sốt...',
      images: 'assets/images/blog/blog3.png',
      abstract: 'Món ăn vặt phổ biến trong giới trẻ...',
      post_date: new Date('2024-02-12'),
      comments: 3,
    },
    {
      blogid: 3,
      title: 'Những món ăn vặt siêu hấp dẫn khi xem phim hoặc tụ họp bạn bè',
      content: 'Bánh ngọt mềm mịn, thơm lừng...',
      images: 'assets/images/blog/blog4.png',
      abstract: 'Bánh ngọt hấp dẫn với nhiều hương vị...',
      post_date: new Date('2024-02-10'),
      comments: 3,
    }]
}
