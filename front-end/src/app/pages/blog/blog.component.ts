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
      title: 'Bánh tráng xoài',
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
      images: 'assets/images/blog/blog1.png',
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
    {
      blogid: 4,
      title: 'Muối tôm',
      content: 'Muối tôm Tây Ninh chấm gì cũng ngon...',
      images: 'assets/images/blog/blog1.png',
      abstract: 'Gia vị chấm quốc dân cho các món ăn...',
      post_date: new Date('2024-02-08'),
      comments: 3,
    },
    {
      blogid: 5,
      title: 'Bánh tráng nướng',
      content: 'Bánh tráng nướng giòn rụm, thơm ngon...',
      images: 'assets/images/blog/blog1.png',
      abstract: 'Món ăn đường phố nổi tiếng...',
      post_date: new Date('2024-02-06'),
      comments: 3,
    },
    {
      blogid: 6,
      title: 'Vegan Options',
      content: 'Các món ăn chay lành mạnh, tốt cho sức khỏe...',
      images: 'assets/images/blog/blog1.png',
      abstract: 'Lựa chọn tuyệt vời cho người ăn chay...',
      post_date: new Date('2024-02-04'),
      comments: 3,
    },
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
