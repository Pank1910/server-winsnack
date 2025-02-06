import { Component } from '@angular/core';

@Component({
  selector: 'app-minigame',
  templateUrl: './minigame.component.html',
  styleUrls: ['./minigame.component.css']
})
export class MinigameComponent {
  
  // Biến lưu trữ thời gian chương trình và thông tin chi tiết sản phẩm
  programStartDate = '01/02/2025';
  programEndDate = '28/02/2025';
  
  // Chứa thông tin sản phẩm bán chạy
  topSellingProducts = [
    {
      name: 'Bánh tráng chà bông',
      image: '/front-end/src/assets/images/product-category/Chabong.png',
      rating: 5.0,
      reviews: 100,
      originalPrice: 30000,
      discountedPrice: 25000
    },
    {
      name: 'Bánh tráng rong biển',
      image: '/front-end/src/assets/images/product-category/Rongbien.png',
      rating: 5.0,
      reviews: 100,
      originalPrice: 30000,
      discountedPrice: 25000
    },
    {
      name: 'Trà xanh chanh dây',
      image: '/front-end/src/assets/images/product-category/Chanhday.png',
      rating: 4.8,
      reviews: 30,
      originalPrice: 95000,
      discountedPrice: 95000
    },
    {
      name: 'Bánh tráng sốt bơ',
      image: '/front-end/src/assets/images/product-category/Bo.png',
      rating: 5.0,
      reviews: 100,
      originalPrice: 30000,
      discountedPrice: 25000
    }
  ];

  // Hàm để xử lý sự kiện "Xem Chi Tiết"
  viewDetails() {
    console.log('Đang xem chi tiết chương trình...');
    // Bạn có thể thêm logic khác ở đây như mở modal hoặc chuyển hướng đến trang chi tiết
  }

  // Hàm xử lý sự kiện "Mua Ngay"
  buyNow() {
    console.log('Đang mua ngay sản phẩm...');
    // Thực hiện logic xử lý mua hàng hoặc chuyển hướng đến trang mua sản phẩm
  }
}
