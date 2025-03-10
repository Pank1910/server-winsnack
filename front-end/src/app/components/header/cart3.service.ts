import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from '../../../../../my-server-mongodb/interface/Cart';
import { CartAPIService } from '../../cart-api.service';
import { AuthService } from '../../services/auth.service';
import { catchError, tap } from 'rxjs/operators';

interface RecommendedProduct {
  productId: string;
  title: string;
  price: number;
  imgbase64_reduce: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  // Thêm một subject riêng cho tổng số sản phẩm và tổng giá
  private cartSummarySubject = new BehaviorSubject<{itemCount: number, totalPrice: number}>({
    itemCount: 0,
    totalPrice: 0
  });
  cartSummary$ = this.cartSummarySubject.asObservable();

  constructor(
    private cartAPIService: CartAPIService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Đăng ký theo dõi thay đổi cartItems để cập nhật tổng số và tổng giá
    this.cartItems$.subscribe(items => {
      this.updateCartSummary(items);
    });
    
    // Đăng ký theo dõi đăng nhập/đăng xuất để cập nhật giỏ hàng
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.loadCartFromDatabase();
      } else {
        this.loadCartFromLocalStorage();
      }
    });
  }

  // Tính toán tổng số lượng và tổng giá
  private updateCartSummary(items: CartItem[]): void {
    const itemCount = items.length;
    const totalPrice = items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
    
    this.cartSummarySubject.next({
      itemCount: itemCount,
      totalPrice: totalPrice
    });
  }

  // Load giỏ hàng từ database
  loadCartFromDatabase(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.userId) {
      console.warn('No user logged in, loading from localStorage instead');
      this.loadCartFromLocalStorage();
      return;
    }

    this.cartAPIService.getCartItems(currentUser.userId)
      .pipe(
        catchError(error => {
          console.error('Error loading cart from database:', error);
          // Nếu có lỗi, thử lấy từ localStorage
          this.loadCartFromLocalStorage();
          return of({ success: false, data: [] });
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Cart API response:', response); // Debug log
          
          // Kiểm tra cấu trúc của response
          if (response.success && Array.isArray(response.data)) {
            this.cartItemsSubject.next(response.data);
          } else if (Array.isArray(response)) {
            // Trường hợp API trả về mảng trực tiếp
            this.cartItemsSubject.next(response);
          } else if (response && Array.isArray(response.data)) {
            // Trường hợp API trả về { data: [...] }
            this.cartItemsSubject.next(response.data);
          } else {
            console.warn('Unexpected response format, cart may be empty:', response);
            this.cartItemsSubject.next([]);
          }
          
          // Sau khi cập nhật từ database, lưu vào localStorage để đồng bộ
          this.saveCartToLocalStorage(this.cartItemsSubject.getValue());
        }
      });
  }

  // Load giỏ hàng từ localStorage (cho người dùng chưa đăng nhập)
  loadCartFromLocalStorage(): void {
    try {
      const cartData = localStorage.getItem('cartItems');
      if (cartData) {
        const items = JSON.parse(cartData) as CartItem[];
        this.cartItemsSubject.next(items);
      } else {
        this.cartItemsSubject.next([]);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.cartItemsSubject.next([]);
    }
  }

  // Lưu giỏ hàng vào localStorage
  private saveCartToLocalStorage(items: CartItem[]): void {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productId: string, quantity: number, unit_price: number, product_name?: string, image_1?: string): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    
    // Tạo item mới
    const newItem: CartItem = {
      isSelected: true,
      productId: productId,
      quantity: quantity,
      unit_price: unit_price,
      product_name: product_name,
      image_1: image_1,
    };
    
    // Thêm vào localStorage (cho cả hai trường hợp)
    const currentItems = this.cartItemsSubject.getValue();
    const existingItemIndex = currentItems.findIndex(item => item.productId === productId);
    
    let updatedItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      updatedItems = [...currentItems, newItem];
    }
    
    // Cập nhật state và localStorage
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToLocalStorage(updatedItems);
    
    // Nếu đã đăng nhập, cập nhật lên server
    if (currentUser && currentUser.userId) {
      return this.cartAPIService.addToCart(currentUser.userId, productId, quantity, unit_price).pipe(
        tap(() => {
          console.log('Item added to cart in database');
        }),
        catchError(error => {
          console.error('Error adding item to cart in database:', error);
          return of({ success: false, message: error.message });
        })
      );
    } else {
      // Nếu chưa đăng nhập, trả về observable thành công
      return of({ success: true, message: 'Item added to cart locally' });
    }
  }

  // Các phương thức khác giữ nguyên, chỉ cần thêm phần lưu localStorage
  // (Phương thức removeFromCart, updateQuantity, vv...)
  
  // Phương thức này giúp đồng bộ giỏ hàng từ localStorage lên database khi đăng nhập
  syncLocalCartToDatabase(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.userId) {
      return;
    }
    
    const localCart = this.cartItemsSubject.getValue();
    if (localCart.length > 0) {
      const simplifiedItems = localCart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));
      
      this.cartAPIService.updateCartItems(currentUser.userId, simplifiedItems).subscribe({
        next: () => {
          console.log('Local cart synced to database');
        },
        error: (error) => {
          console.error('Error syncing local cart to database:', error);
        }
      });
    }
  }
}