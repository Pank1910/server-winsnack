import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductApiService } from '../../product-api.service';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { CartService } from '../../components/header/cart3.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { LocalStorageService } from '../../services/localStorage.service';

interface Review {
  reviewerName: string;
  rating: number; // 1-5
  reviewDate: string;
  content: string;
}

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

  // Thuộc tính cho chức năng đánh giá mới
  reviews: Review[] = [
    {
      reviewerName: 'Thanh Tý',
      rating: 5,
      reviewDate: '3 tháng trước',
      content: 'Mình là người khó tính về đồ ăn vặt nhưng bánh tráng rong biển này thực sự rất ngon. Giòn, vị rong biển đậm đà, ăn hoài không ngán.'
    },
    {
      reviewerName: 'Bảo Trân',
      rating: 5,
      reviewDate: '5 tháng trước',
      content: 'Sản phẩm đóng gói đẹp, vệ sinh. Mùi thơm, vị ngon, ăn rất cuốn. Đã trở thành món ăn vặt yêu thích của gia đình mình.'
    },
    {
      reviewerName: 'Minh Khôi',
      rating: 4,
      reviewDate: '1 tháng trước',
      content: 'Bánh giòn, vị sốt me ngon nhưng mình thích thêm cay hơn một chút. Tổng thể là ổn!'
    }
  ];
  showReviewConfirmPopup = false;
  @Input() productId: string = '';
  @Output() favoriteChanged = new EventEmitter<boolean>();
  
  isFavorite: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private productAPIService: ProductApiService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private localStorageService: LocalStorageService
  ) {
    console.log('LocalStorageService initialized:', !!this.localStorageService);
  }

  ngOnInit(): void {
    // Thêm console.log
    console.log('Component initialized with productId:', this.productId);
    
    // Kiểm tra trạng thái đăng nhập
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log('User logged in:', this.isLoggedIn);
    
    // Đăng ký theo dõi thay đổi đăng nhập
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      console.log('Login status changed:', loggedIn);
    });
  
    // Lấy id sản phẩm từ URL
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.productId = productId; // Lưu productId
        console.log('ProductId from URL:', productId);
        this.loadProductDetails(productId);
        this.checkFavoriteStatus(); // Kiểm tra trạng thái yêu thích
      } else {
        this.errorMessage = 'Không tìm thấy sản phẩm';
        this.isLoading = false;
      }
    });
  }

  onFavoriteChanged(productId: string, isFavorite: boolean): void {
    console.log(`Sản phẩm ${productId} ${isFavorite ? 'đã được thêm vào' : 'đã bị xóa khỏi'} danh sách yêu thích`);
  }
  

  // Sửa phương thức kiểm tra trạng thái yêu thích
  checkFavoriteStatus(): void {
    try {
      if (this.productId) {
        // Đảm bảo localStorageService đã được khởi tạo
        if (this.localStorageService) {
          this.isFavorite = this.localStorageService.isFavorite(this.productId);
          console.log('Favorite status checked:', this.productId, this.isFavorite);
        }
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
      this.isFavorite = false;
    }
  }
  
  toggleFavorite(productId?: string): void {
    try {
      const id = productId || this.productId;
      
      if (this.isFavorite) {
        this.localStorageService.removeFromFavorites(id);
        console.log('Removed from favorites:', id);
      } else {
        this.localStorageService.addToFavorites(id);
        console.log('Added to favorites:', id);
      }
      
      // Cập nhật trạng thái
      this.isFavorite = this.localStorageService.isFavorite(id);
      this.favoriteChanged.emit(this.isFavorite);
      
      // Hiển thị thông báo (optional)
      this.successMessage = this.isFavorite ? 'Đã thêm vào danh sách yêu thích' : 'Đã xóa khỏi danh sách yêu thích';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }
  
  // Xử lý khi người dùng submit form đánh giá
  handleReviewSubmit(event: Event): void {
    event.preventDefault();
    
    // Kiểm tra đã chọn rating chưa
    if (!this.userRating) {
      this.showRatingRequiredPopup = true;
      return;
    }
  
    // Hiển thị popup xác nhận gửi đánh giá
    this.showReviewConfirmPopup = true;
  }

  // Xác nhận gửi đánh giá
  confirmReview(): void {
    // Tạo đánh giá mới
    const newReview: Review = {
      reviewerName: 'Cá voi xanh',
      rating: this.userRating,
      reviewDate: 'Vừa xong',
      content: this.reviewText
    };

    // Thêm vào đầu danh sách
    this.reviews.unshift(newReview);

    // Đóng popup xác nhận
    this.showReviewConfirmPopup = false;

    // Hiển thị popup thành công
    this.showReviewSuccessPopup = true;

    // Reset form
    this.resetReviewForm();
  }

  // Hủy gửi đánh giá
  cancelReview(): void {
    this.showReviewConfirmPopup = false;
  }

  // Reset form sau khi gửi đánh giá
  resetReviewForm(): void {
    // Reset rating
    this.userRating = 0;
    const ratingInputs = document.querySelectorAll('input[name="rating"]') as NodeListOf<HTMLInputElement>;
    ratingInputs.forEach(input => {
      input.checked = false;
    });

    // Reset text
    this.reviewText = '';
    const textarea = document.querySelector('.review-form-container textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = '';
    }
  }

  // Chuyển số rating thành chuỗi sao
  getRatingStars(rating: number): string {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '★';
      } else {
        stars += '☆';
      }
    }
    return stars;
  }

  // Tạo mảng để loop trong template
  createRange(count: number): number[] {
    return Array(count).fill(0).map((_, index) => index + 1);
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.productAPIService.getProductById(productId).subscribe({
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
  
    // Thêm vào giỏ hàng với đầy đủ thông tin
    this.cartService.addToCart(
      this.product._id,
      this.quantity,
      this.product.unit_price,
      this.product.product_name,  // Thêm tên sản phẩm
      this.product.image_1        // Thêm hình ảnh
    ).subscribe({
      next: (response) => {
        this.successMessage = 'Đã thêm sản phẩm vào giỏ hàng';
        this.showPopup = true;  // Hiển thị popup thông báo
        
        // Hiển thị thông báo success trong 3 giây
        setTimeout(() => {
          this.successMessage = '';
          this.showPopup = false;
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