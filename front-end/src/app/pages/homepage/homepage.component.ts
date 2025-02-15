import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from '../../components/subscription/subscription.component';
// import { slideInOutAnimation } from 'src/app/models/slide-in-out.animation';
// import { scaleInOutAnimation } from 'src/app/models/scale-in-out.animation';
// import { fadeInOutAnimation } from 'src/app/models/fade-in-out.animation';
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterModule, CommonModule, SubscriptionComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  // animations: [slideInOutAnimation ,scaleInOutAnimation,fadeInOutAnimation,
  // ],

})
export class HomepageComponent {
   constructor(private router: Router) { }
  // Data for Category Section
  categoryCards = [
    {
      imageUrl: 'assets/images/homepage/category-1.png',
      altText: 'Bánh tráng trộn',
      title: 'Bánh tráng trộn',
      price: 15000
    },
    {
      imageUrl: '/assets/images/homepage/category-2.png',
      altText: 'Bánh tráng nướng',
      title: 'Bánh tráng nướng',
      price: 20000
    },
    {
      imageUrl: '/assets/images/homepage/category-1.png',
      altText: 'Snack Hàn Quốc',
      title: 'Snack Hàn Quốc',
      price: 25000
    },
    {
      imageUrl: '/assets/images/homepage/category-2.png',
      altText: 'Bánh tráng chấm',
      title: 'Bánh tráng chấm',
      price: 18000
    }
  ];

  // Data for Best Selling Products
  products = [
    {
      imageUrl: '/assets/images/homepage/chabong.png',
      name: 'Bánh tráng trộn đặc biệt',
      discount: 20,
      rating: 4.9,
      reviews: 235,
      originalPrice: 25000,
      discountedPrice: 20000,
      description: 'Kết hợp 6 loại gia vị đặc trưng'
    },
    {
      imageUrl: '/assets/images/homepage/rongbien.png',
      name: 'Bánh tráng nướng truyền thống',
      discount: 15,
      rating: 4.8,
      reviews: 189,
      originalPrice: 30000,
      discountedPrice: 25500,
      description: 'Công thức gia truyền 3 đời'
    },
    {
      imageUrl: '/assets/images/homepage/chabong.png',
      name: 'Set snack Hàn Quốc',
      discount: 30,
      rating: 4.95,
      reviews: 356,
      originalPrice: 120000,
      discountedPrice: 84000,
      description: 'Combo 10 gói snack đủ vị'
    },
    {
      imageUrl: '/assets/images/homepage/rongbien.png',
      name: 'Bánh tráng muối ớt',
      discount: 10,
      rating: 4.7,
      reviews: 156,
      originalPrice: 15000,
      discountedPrice: 13500,
      description: 'Vị cay xé lưỡi đặc trưng'
    }
  ];

  // Data for Blog Section
  blogPosts = [
    {
      id: 1,
      image: 'assets/images/homepage/blog-post-1.png',
      title: 'Cách làm bánh tráng trộn chuẩn vị Sài Gòn',
      comments: 45,
      time: '15 phút trước'
    },
    {
      id: 2,
      image: 'assets/images/homepage/blog-post-2.png',
      title: 'Top 10 món snack Hàn Quốc hot nhất 2024',
      comments: 28,
      time: '2 giờ trước'
    },
    {
      id: 3,
      image: 'assets/images/homepage/blog-post-3.png',
      title: 'Hướng dẫn phối đồ ăn vặt healthy',
      comments: 67,
      time: '5 giờ trước'
    }
  ];
  // navigateToEvent() {
  //   this.router.navigate(['/event']);
  // }

  // navigateToAboutUs() {
  //   this.router.navigate(['/about-us']);
  // }

  // navigateToProducts() {
  //   this.router.navigate(['/product']);
  // }

  // navigateToBlogs() {
  //   this.router.navigate(['/blog']);
  // }
}