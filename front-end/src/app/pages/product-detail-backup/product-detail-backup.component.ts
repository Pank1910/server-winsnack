import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductApiService } from '../../product-api.service';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { CartService } from '../../components/header/cart3.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail-backup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './product-detail-backup.component.html',
  styleUrls: ['./product-detail-backup.component.css']
})
export class ProductDetailBackupComponent implements OnInit {
  product!: Product;
  quantity: number = 1;
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  isLoggedIn: boolean = false;
  
  // Các thuộc tính mới từ backup component
  activeTab: string = 'description';
  userRating = 0;
  selectedWeight = 100;
  showPopup = false;
  reviewText = '';
  showReviewSuccessPopup = false;
  showRatingRequiredPopup = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductApiService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // Đăng ký theo dõi thay đổi đăng nhập
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    // Lấy id sản phẩm từ URL
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(productId);
      } else {
        this.errorMessage = 'Không tìm thấy sản phẩm';
        this.isLoading = false;
      }
    });
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
        } else {
          this.errorMessage = 'Không tìm thấy thông tin sản phẩm';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Đã xảy ra lỗi khi tải thông tin sản phẩm';
        console.error('Error loading product details:', error);
        this.isLoading = false;
      }
    });
  }

  // Tăng số lượng sản phẩm
  increaseQuantity(): void {
    if (this.product && this.quantity < (this.product.stocked_quantity || 99)) {
      this.quantity++;
    }
  }

  // Giảm số lượng sản phẩm
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Thêm phương thức từ backup component
  changeQuantity(change: number): void {
    if (change > 0) {
      this.increaseQuantity();
    } else {
      this.decreaseQuantity();
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(): void {
    // Kiểm tra đăng nhập
    if (!this.isLoggedIn) {
      // Lưu URL hiện tại để sau khi đăng nhập sẽ quay lại
      localStorage.setItem('redirectAfterLogin', this.router.url);
      
      // Chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
      return;
    }

    // Kiểm tra sản phẩm và số lượng
    if (!this.product) {
      this.errorMessage = 'Không tìm thấy thông tin sản phẩm';
      return;
    }

    // Thêm vào giỏ hàng
    this.cartService.addToCart(
      this.product._id,
      this.quantity,
      this.product.unit_price
    ).subscribe({
      next: (response) => {
        this.successMessage = 'Đã thêm sản phẩm vào giỏ hàng';
        this.showPopup = true;  // Hiển thị popup từ backup component
        
        // Hiển thị thông báo success trong 3 giây
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        if (error.message === 'User not logged in') {
          this.errorMessage = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng';
        } else {
          this.errorMessage = 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng';
        }
        
        console.error('Error adding to cart:', error);
        
        // Hiển thị thông báo lỗi trong 3 giây
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  // Định dạng giá tiền
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(price) + 'đ';
  }

  // Mua ngay
  buyNow(): void {
    this.addToCart();
    // Đợi một chút để đảm bảo sản phẩm đã được thêm vào giỏ hàng
    setTimeout(() => {
      this.router.navigate(['/cart']);
    }, 500);
  }

  // Các phương thức mới từ backup component
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setRating(rating: number): void {
    this.userRating = rating;
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
    if (this.product) {
      return this.product.unit_price * (1 - (this.product.discount || 0));
    }
    return 0;
  }
}