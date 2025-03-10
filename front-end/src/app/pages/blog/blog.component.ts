import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SubscriptionComponent } from '../../components/subscription/subscription.component';
import { BlogCategoryComponent } from '../../components/blog-category/blog-category.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SubscriptionComponent,
    BlogCategoryComponent
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  constructor(private router: Router) { }
    // Data for 
  // Danh sách bài viết
  blogs = [
    {
      blogid: 1,
      title: 'Cách làm bánh tráng trộn chuẩn vị Sài Gòn',
      content: 'Món ăn vặt đặc sản Nha Trang...',
      images: 'assets/images/blog/blog1.png',
      abstract: 'Bánh tráng xoài dẻo, thơm ngon...',
      post_date: new Date('2024-02-14'),
      comments: 3,
    },
    {
      blogid: 2,
      title: 'Bánh tráng chấm',
      content: 'Bánh tráng chấm với nhiều loại sốt...',
      images: 'assets/images/blog/blog2.png',
      abstract: 'Món ăn vặt phổ biến trong giới trẻ...',
      post_date: new Date('2024-02-12'),
      comments: 3,
    },
    {
      blogid: 3,
      title: 'Bánh ngọt',
      content: 'Bánh ngọt mềm mịn, thơm lừng...',
      images: 'assets/images/blog/blog1.png',
      abstract: 'Bánh ngọt hấp dẫn với nhiều hương vị...',
      post_date: new Date('2024-02-10'),
      comments: 3,
    }]

    newBlogs = [
      { id: 1, title: 'Bánh tráng xoài', images: 'assets/images/blog/new-blog-1.png' },
      { id: 2, title: 'Bánh tráng chấm', images: 'assets/images/blog/new-blog-2.png' },
      { id: 3, title: 'Bánh ngọt', images: 'assets/images/blog/new-blog-3.png' },
      { id: 4, title: 'Muối tôm', images: 'assets/images/blog/new-blog-4.png' },
      { id: 5, title: 'Bánh tráng nướng', images: 'assets/images/blog/new-blog-5.png' }
  ];
  
  currentBlogIndex = 0;

  previousBlog() {
    if (this.currentBlogIndex > 0) {
      this.currentBlogIndex--;
    } else {
      this.currentBlogIndex = this.blogs.length - 1;
    }
  }

  nextBlog() {
    if (this.currentBlogIndex < this.blogs.length - 1) {
      this.currentBlogIndex++;
    } else {
      this.currentBlogIndex = 0;
    }
  }

  showCategory: boolean = false;

  // Khi click vào header, bật component con hiển thị danh mục
  selectCategory(): void {
    this.showCategory = !this.showCategory;
  }
}
