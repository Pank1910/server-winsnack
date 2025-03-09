import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { ProductApiService } from '../../product-api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SubscriptionComponent } from '../../components/subscription/subscription.component';
import { RouterModule, Router } from '@angular/router';
import { SwiperOptions } from 'swiper/types';
import { Navigation } from 'swiper/modules';
import { register } from 'swiper/element/bundle';
register(); // Đăng ký Swiper custom elements

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SubscriptionComponent, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['swiper/swiper-bundle.min.css','./homepage.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomepageComponent implements OnInit, OnDestroy {
  // Thêm property cho interval
  private banhTrangInterval: any;

  swiperParams: SwiperOptions = {
    modules: [Navigation],
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: true,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1280: { slidesPerView: 4 }
    }
  };

  featuredProducts: Product[] = [];
  bestSellerProducts: Product[] = [];
  loading = false;
  error = '';

  blogPosts = [
    {
      id: 1,
      image: 'assets/images/homepage/blog-post-1.png',
      title: 'Cách làm bánh tráng trộn chuẩn Xì Gòn',
      comments: 45,
      time: '15 phút trước'
    },
    {
      id: 2,
      image: 'assets/images/homepage/blog-post-2.png',
      title: 'Quy trình sản xuất bánh tráng Tây Ninh',
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
    // Khởi tạo Swiper thủ công
    const swiperEl = document.querySelector('swiper-container');
    if (swiperEl) {
      Object.assign(swiperEl, this.swiperParams);
      swiperEl.initialize();
    }

    // Thêm hiệu ứng bánh tráng
    this.initBanhTrangEffect();
  }

// Thêm phương thức này vào component của bạn
initBanhTrangEffect(): void {
  // Xóa container cũ nếu có
  const oldContainer = document.getElementById("banhTrangContainer");
  if (oldContainer && oldContainer.parentNode) {
    oldContainer.parentNode.removeChild(oldContainer);
  }

  // Tạo container mới và gắn trực tiếp vào body
  const container = document.createElement("div");
  container.id = "banhTrangContainer";
  
  // Thiết lập style trực tiếp để đảm bảo container đúng kích thước và vị trí
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0", 
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: "100"
  });
  
  document.body.appendChild(container);
  
  const images = [
    "assets/images/homepage/banh-trang-1.png",
    "assets/images/homepage/banh-trang-2.png",
    "assets/images/homepage/banh-trang-3.png"
  ];
  
  // Tạo ngay một số bánh tráng ban đầu trên toàn màn hình
  for (let i = 0; i < 10; i++) {
    setTimeout(() => this.createBanhTrang(container, images), i * 200);
  }
  
  // Xóa interval cũ nếu có
  if (this.banhTrangInterval) {
    clearInterval(this.banhTrangInterval);
  }
  
  // Tạo bánh tráng liên tục
  this.banhTrangInterval = setInterval(() => this.createBanhTrang(container, images), 500);

  // Dừng hiệu ứng sau 30 giây
  setTimeout(() => {
    if (this.banhTrangInterval) {
      clearInterval(this.banhTrangInterval);
      this.banhTrangInterval = null;
    }
  }, 30000); // 30 giây

}

// Phương thức tạo bánh tráng mới và cải tiến
createBanhTrang(container: HTMLElement, images: string[]): void {
  if (!container) return;
  
  const banhTrang = document.createElement("img");
  banhTrang.src = images[Math.floor(Math.random() * images.length)];
  banhTrang.classList.add("banh-trang");
  
  // Phân bố ngẫu nhiên trên TOÀN BỘ chiều rộng của màn hình
  // Đây là điểm quan trọng: Đảm bảo rằng bánh tráng xuất hiện ở mọi nơi
  const randomLeftPercent = Math.random() * 100;
  
  // Thiết lập style trực tiếp cho bánh tráng
  Object.assign(banhTrang.style, {
    position: "absolute",
    left: `${randomLeftPercent}%`,
    top: "-50px",
    width: `${Math.random() * 10 + 20}px`, // Kích thước từ 30px đến 50px
    opacity: `${Math.random() * 0.2 + 0.7}`, // Độ trong suốt từ 0.7 đến 0.9
    animationName: "fall",
    animationDuration: `${Math.random() * 4 + 4}s`, // Thời gian rơi 4-8s
    animationTimingFunction: "linear",
    animationIterationCount: "1"
  });
  
  // Thêm vào container
  container.appendChild(banhTrang);
  
  // Định nghĩa animation trực tiếp qua JavaScript nếu CSS chưa được áp dụng
  if (!document.getElementById("banhTrangStyle")) {
    const style = document.createElement("style");
    style.id = "banhTrangStyle";
    style.textContent = `
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.5;
        }
        100% {
          transform: translateY(calc(100vh + 50px)) rotate(${Math.random() > 0.5 ? 360 : -360}deg);
          opacity: 0.7;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Xóa sau khi hoàn thành animation
  const duration = parseFloat(banhTrang.style.animationDuration);
  setTimeout(() => {
    if (banhTrang.parentNode) {
      banhTrang.parentNode.removeChild(banhTrang);
    }
  }, duration * 1000);
}

// Phương thức dọn dẹp
ngOnDestroy(): void {
  // Hủy interval
  if (this.banhTrangInterval) {
    clearInterval(this.banhTrangInterval);
    this.banhTrangInterval = null;
  }
  
  // Xóa container và style
  const container = document.getElementById("banhTrangContainer");
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
  
  const style = document.getElementById("banhTrangStyle");
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }
}

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getAllProducts().subscribe({
      next: (response) => {
        const allProducts = response.data;
        this.featuredProducts = allProducts.slice(0, 8);
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

  ngAfterViewInit(): void {
    const blogSection = document.querySelector("section.bg-[#FFF8EC]") as HTMLElement;
    const mascot = document.getElementById("mascot");
    
    if (!blogSection || !mascot) {
      console.error("Cannot find elements");
      return;
    }
    
    // Mặc định hiển thị mascot
    mascot.style.opacity = "1";
    
    window.addEventListener('scroll', () => {
      const rect = blogSection.getBoundingClientRect();
      const isVisible = 
        rect.top < window.innerHeight && 
        rect.bottom > 0;
      
      mascot.style.opacity = isVisible ? "1" : "0";
    });
  }
}