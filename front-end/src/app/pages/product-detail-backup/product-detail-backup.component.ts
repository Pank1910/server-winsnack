import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail-backup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './product-detail-backup.component.html',
  styleUrl: './product-detail-backup.component.css'
})
export class ProductDetailBackupComponent implements OnInit {
  activeTab: string = 'description';
  userRating: number = 0;
  quantity: number = 1;
  selectedWeight: number = 100;
  showPopup: boolean = false;
  reviewText: string = '';

  showReviewSuccessPopup: boolean = false; // Biến điều khiển hiển thị popup thành công
  showRatingRequiredPopup: boolean = false; // Biến điều khiển hiển thị popup yêu cầu chọn sao

  constructor(private router: Router) { }

  ngOnInit(): void {
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

  selectWeight(weight: number): void {
    this.selectedWeight = weight;
  }
  

  // Thêm hàm xử lý khi nhấn nút "THÊM VÀO GIỎ HÀNG"
  addToCart(): void {
  // Logic thêm vào giỏ hàng ở đây
  // Ví dụ: gọi API hoặc lưu vào local storage
  
  // Hiển thị popup
  this.showPopup = true;
}

// Thêm hàm đóng popup
closePopup(): void {
  this.showPopup = false;
}

goToCart(): void {
  // Chuyển hướng đến trang giỏ hàng
  this.router.navigate(['/cart']);
  this.closePopup();
}

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


// Hàm gửi đánh giá
submitReview(): void {
  // Kiểm tra xem người dùng đã chọn sao chưa
  if (!this.userRating || this.userRating === 0) {
    this.showRatingRequiredPopup = true; // Hiển thị popup yêu cầu chọn sao
    return; // Dừng hàm nếu chưa chọn sao
  }

  // Xử lý gửi đánh giá (ví dụ: gọi API)
  // ...

  // Sau khi gửi thành công, hiển thị popup thành công
  this.showReviewSuccessPopup = true;

  // Làm trống thanh ngôi sao và ô nhập văn bản
  this.userRating = 0;
  this.reviewText = '';

  // Tự động đóng popup thành công sau 3 giây
  // setTimeout(() => {
  //   this.closeReviewSuccessPopup();
  // }, 3000);
}

// Hàm đóng popup thành công
closeReviewSuccessPopup(): void {
  this.showReviewSuccessPopup = false;
}

// Hàm đóng popup yêu cầu chọn sao
closeRatingRequiredPopup(): void {
  this.showRatingRequiredPopup = false;
}

}