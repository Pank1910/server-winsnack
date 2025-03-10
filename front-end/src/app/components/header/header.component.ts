import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { ProductApiService } from '../../product-api.service';
import { FormsModule } from '@angular/forms';
import { CartService } from './cart3.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Đảm bảo biến này được khai báo đúng cách
  showAllProducts: boolean = false;  
  showAbout = false;
  showUserMenu = false;
  isLoggedIn = false;
  currentUser: any = null;
  header = {
    favorites: { number: 10 },
    cart: { number: 0 },
    price: 0,
  };
  searchTerm: string = '';
  searchResults: Product[] = [];
  showDropdown: boolean = false;
  private searchSubject = new Subject<string>();
  private cartSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private productService: ProductApiService,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập ban đầu
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    
    // Đăng ký lắng nghe sự kiện đăng nhập/đăng xuất
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
      
      // Nếu đăng nhập, tải giỏ hàng; nếu đăng xuất, reset giỏ hàng
      if (loggedIn) {
        this.cartService.loadCartFromDatabase();
      } else {
        this.header.cart.number = 0;
        this.header.price = 0;
      }
    });

    // Thiết lập debounce để giảm số lần gọi API khi người dùng gõ
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchProducts(term);
    });

    // Theo dõi thay đổi trong giỏ hàng
    this.cartSubscription = this.cartService.cartItems$.subscribe(
      (items) => {
        // Tính tổng số lượng sản phẩm (tổng của các quantity)
        this.header.cart.number = items ? items.reduce((total, item) => 
          total + (item.quantity || 0), 0) : 0;
        
        // Tính tổng giá trị giỏ hàng
        this.header.price = items ? items.reduce((total, item) => 
          total + (item.unit_price * item.quantity), 0) : 0;
          
        console.log('Cart updated:', this.header.cart.number, 'items, total:', this.header.price);
      },
      (error) => {
        console.error('Error subscribing to cartItems$:', error);
      }
    );

    // Tải giỏ hàng ban đầu nếu người dùng đã đăng nhập
    if (this.isLoggedIn) {
      this.cartService.loadCartFromDatabase();
    }
  }

  ngOnDestroy(): void {
    // Hủy subscription khi component bị hủy
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Định dạng giá tiền với đơn vị VND
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(price) + 'đ';
  }

  // Cập nhật searchTerm và gửi đến Subject
  onSearchChange(event: any): void {
    const term = event.target.value;
    this.searchTerm = term;
    
    if (term.trim() === '') {
      this.searchResults = [];
      this.showDropdown = false;
    } else {
      this.searchSubject.next(term);
      this.showDropdown = true;
    }
  }

  // Tìm kiếm sản phẩm dựa trên term
  searchProducts(term: string): void {
    if (!term.trim()) {
      this.searchResults = [];
      return;
    }

    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success) {
          // Lọc sản phẩm theo từ khóa tìm kiếm
          this.searchResults = response.data.filter(product => 
            product.product_name.toLowerCase().includes(term.toLowerCase())
          ).slice(0, 5); // Giới hạn 5 kết quả
        }
      },
      error: (error) => {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      }
    });
  }

  // Điều hướng đến trang chi tiết sản phẩm
  goToProductDetail(productId: string): void {
    this.router.navigate(['/product-detail', productId]);
    this.searchTerm = '';
    this.searchResults = [];
    this.showDropdown = false;
  }

  // Thực hiện tìm kiếm khi nhấn nút search
  performSearch(): void {
    if (this.searchTerm.trim()) {
      // Nếu có kết quả và người dùng nhấn nút search, chuyển đến trang kết quả tìm kiếm
      this.router.navigate(['/search-results'], { 
        queryParams: { q: this.searchTerm } 
      });
      this.showDropdown = false;
    }
  }

  // Đóng dropdown khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    if (!element.closest('.search-container')) {
      this.showDropdown = false;
    }
  }

  toggleShowAllProducts(): void {
    this.showAllProducts = !this.showAllProducts;
  }

  toggleShowAbout(): void {
    this.showAbout = !this.showAbout;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }

  getProfileInitial(): string {
    if (this.currentUser && this.currentUser.profileName) {
      return this.currentUser.profileName.charAt(0).toUpperCase();
    }
    return 'U';
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

  navigateToCategory(category: string, event: Event) {
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền
    this.showAllProducts = false;
    this.router.navigate(['/product-category'], { 
      queryParams: { category: category } 
    });
  }
}