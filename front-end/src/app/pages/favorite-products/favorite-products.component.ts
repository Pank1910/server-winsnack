import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-favorite-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './favorite-products.component.html',
  styleUrls: ['./favorite-products.component.css']
})
export class FavoriteProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  favoriteIds: string[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteProducts();
    
    // Đăng ký lắng nghe thay đổi danh sách yêu thích
    this.localStorageService.favorites$.subscribe(() => {
      this.loadFavoriteProducts();
    });
  }

  loadFavoriteProducts(): void {
    this.loading = true;
    this.error = '';
    
    // Lấy danh sách ID sản phẩm yêu thích từ LocalStorageService
    this.favoriteIds = this.localStorageService.getFavoriteIds();
    
    if (this.favoriteIds.length === 0) {
      this.loading = false;
      return;
    }

    this.productService.getFavoriteProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Có lỗi xảy ra khi tải dữ liệu sản phẩm yêu thích.';
        this.loading = false;
        console.error('Lỗi khi tải sản phẩm yêu thích:', err);
      }
    });
  }

  removeFromFavorites(productId: string): void {
    this.localStorageService.removeFromFavorites(productId);
    // Cập nhật danh sách hiển thị
    this.products = this.products.filter(product => product._id !== productId);
    this.favoriteIds = this.localStorageService.getFavoriteIds();
  }

  addToCart(product: Product): void {
    // Lấy giỏ hàng hiện tại từ localStorage
    const cartItemsStr = localStorage.getItem('cartItems');
    const cartItems = cartItemsStr ? JSON.parse(cartItemsStr) : [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cartItems.find((item: any) => item.productId === product._id);
    
    if (existingItem) {
      // Nếu đã có, tăng số lượng
      existingItem.quantity += 1;
    } else {
      // Nếu chưa có, thêm mới
      cartItems.push({
        productId: product._id,
        name: product.product_name,
        price: product.unit_price * (1 - product.discount),
        image: product.image_1,
        quantity: 1
      });
    }
    
    // Lưu lại vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Thông báo cho người dùng
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  }

  truncateDescription(detail: any): string {
    if (!detail) return '';
    
    // Chuyển đổi sang string nếu không phải string
    const detailStr = typeof detail === 'string' ? detail : String(detail);
    
    if (detailStr.length <= 100) {
      return detailStr;
    }
    return detailStr.substring(0, 100) + '...';
  }

  navigateToProductDetail(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  getStars(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }

  // Tính giá sau khi giảm giá
  getDiscountedPrice(price: number, discount: number): number {
    return price * (1 - discount);
  }
}