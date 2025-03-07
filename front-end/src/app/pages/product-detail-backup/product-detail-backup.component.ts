import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductApiService } from '../../product-api.service';
import { Product } from '../../../../../my-server-mongodb/interface/Product';

@Component({
  selector: 'app-product-detail-backup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './product-detail-backup.component.html',
  styleUrls: ['./product-detail-backup.component.css']
})
export class ProductDetailBackupComponent implements OnInit {
  product!: Product;
  loading = true;
  error = '';

  activeTab: string = 'description';
  userRating = 0;
  quantity = 1;
  selectedWeight = 100;
  showPopup = false;
  reviewText = '';

  showReviewSuccessPopup = false;
  showRatingRequiredPopup = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductApiService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductDetail(productId);
    } else {
      this.error = 'Không tìm thấy sản phẩm!';
    }
  }

  fetchProductDetail(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
        } else {
          this.error = 'Dữ liệu sản phẩm không hợp lệ!';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.';
        console.error('Lỗi:', err);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  changeQuantity(change: number): void {
    const newValue = this.quantity + change;
    if (newValue >= 1) {
      this.quantity = newValue;
    }
  }

  navigateToProductCategory(): void {
    this.router.navigate(['/product-category']);
  }
  navigateToHomepage(): void {
    this.router.navigate(['/homepage']);
  }
  selectWeight(weight: number): void {
    this.selectedWeight = weight;
  }

  addToCart(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
    this.closePopup();
  }

  submitReview(): void {
    if (!this.userRating) {
      this.showRatingRequiredPopup = true;
      return;
    }
    this.showReviewSuccessPopup = true;
    this.userRating = 0;
    this.reviewText = '';
  }

  closeReviewSuccessPopup(): void {
    this.showReviewSuccessPopup = false;
  }

  closeRatingRequiredPopup(): void {
    this.showRatingRequiredPopup = false;
  }

  getDiscountedPrice(): number {
    return this.product.unit_price * (1 - this.product.discount);
  }
}