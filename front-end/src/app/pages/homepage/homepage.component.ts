import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { ProductApiService } from '../../product-api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SubscriptionComponent } from '../../components/subscription/subscription.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SubscriptionComponent, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  featuredProducts: Product[] = [];
  bestSellerProducts: Product[] = [];
  loading = false;
  error = '';

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

  constructor(private productService: ProductApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getAllProducts().subscribe({
      next: (response) => {
        const allProducts = response.data;
        this.featuredProducts = allProducts.slice(0, 4);
        this.bestSellerProducts = allProducts.slice(4, 8);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Lỗi tải sản phẩm:', err);
      }
    });
  }

  getDiscountedPrice(product: Product): number {
    return product.unit_price * (1 - product.discount);
  }

  goToProductDetail(productId: string): void {
    this.router.navigate(['/product-detail', productId]);
  }

  goToBlog(postId: number): void {
    this.router.navigate(['/blog', postId]);
  }
}
