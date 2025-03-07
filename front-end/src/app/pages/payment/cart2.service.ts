import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CartItem } from '../../../../../my-server-mongodb/interface/Cart';
import { throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class Cart2Service {
  private apiUrl = 'http://localhost:5000/cart'; // Điều chỉnh URL API của bạn
  
  // Subject để theo dõi các thay đổi trong giỏ hàng
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  // private getUserId(): string {
  //   return localStorage.getItem('userId') || 
  //          sessionStorage.getItem('userId') || 
  //          '123457'; // ID dự phòng
  // }

  constructor(private http: HttpClient, private authService: AuthService) {
    // Tải giỏ hàng từ server khi khởi tạo service
    this.loadCart();
  }

  getUserId(): string | null {
    const currentUser = this.authService.getCurrentUser(); // Gọi từ instance
    return currentUser ? currentUser.userId : '123457';
}

  // Tải giỏ hàng từ server
  loadCart(): void {
    // Thử các phương án lấy userId
    const userId = 
        localStorage.getItem('userId') || 
        sessionStorage.getItem('userId') || 
        '123457';

    console.log('Attempted userId sources:', {
        localStorageUserId: localStorage.getItem('userId'),
        sessionStorageUserId: sessionStorage.getItem('userId'),
        finalUserId: userId
    });

    // In ra toàn bộ localStorage để kiểm tra
    console.log('Entire localStorage:', {
        ...localStorage
    });

    if (!userId) {
        console.error('No userId found. Checking alternative methods.');
        
        // Thử các phương án khác
        const hardcodedUserId = 'default-user-id'; // Thay bằng ID mặc định của bạn
        
        this.http.get<CartItem[]>(`${this.apiUrl}/items`, { 
            params: { userId: hardcodedUserId } 
        }).subscribe({
            next: (items: CartItem[]) => {
                console.log('Loaded cart items with hardcoded userId:', items);
                this.cartItemsSubject.next(items);
            },
            error: (err) => {
                console.error('Error fetching cart items:', err);
                this.cartItemsSubject.next([]);
            }
        });

        return;
    }

    // Gọi API với userId tìm được
    this.http.get<CartItem[]>(`${this.apiUrl}/items`, { 
        params: { userId: userId } 
    }).subscribe({
        next: (items: CartItem[]) => {
            console.log('Loaded cart items:', items);
            this.cartItemsSubject.next(items);
        },
        error: (err) => {
            console.error('Error fetching cart items:', err);
            this.cartItemsSubject.next([]);
        }
    });
}

  // Lấy các sản phẩm đã chọn để thanh toán
  getSelectedItems(): CartItem[] {
    const allItems = this.cartItemsSubject.value;
    console.log('All cart items before filtering:', allItems);
    const filteredItems = allItems.filter(item => item.quantity > 0);
    console.log('Items after quantity filter:', filteredItems);
    return filteredItems;
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/add`, item).pipe(
      tap(newItem => {
        const currentItems = this.cartItemsSubject.value;
        const updatedItems = [...currentItems, newItem];
        this.cartItemsSubject.next(updatedItems);
      })
    );
  }

  // Cập nhật số lượng sản phẩm
  updateItemQuantity(productId: string, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.apiUrl}/update/${productId}`, { quantity }).pipe(
      tap(updatedItem => {
        const currentItems = this.cartItemsSubject.value;
        const updatedItems = currentItems.map(item => 
          item.productId === productId ? updatedItem : item
        );
        this.cartItemsSubject.next(updatedItems);
      })
    );
  }

  // Xóa sản phẩm khỏi giỏ hàng
  // Fix for removeFromCart method
removeFromCart(productId: string): Observable<any> {
  const userId = this.getUserId();
  
  // Guard against null userId
  if (!userId) {
    console.error('No userId available for cart operation');
    return throwError(() => new Error('User ID not available'));
  }
  
  return this.http.delete(`${this.apiUrl}/remove/${productId}`, {
    params: { userId },
    responseType: 'text' // Change response type expectation
  }).pipe(
    tap(() => {
      const currentItems = this.cartItemsSubject.value;
      const updatedItems = currentItems.filter(item => item.productId !== productId);
      this.cartItemsSubject.next(updatedItems);
    }),
    // Map to void to match return type expectation
    map(() => undefined)
  );
}

  // Xóa toàn bộ giỏ hàng
  clearCart(): Observable<any> {
    const userId = this.getUserId();
    
    // Guard against null userId
    if (!userId) {
      console.error('No userId available for clearing cart');
      // Still clear the local cart
      this.cartItemsSubject.next([]);
      return throwError(() => new Error('User ID not available'));
    }
    
    const params = new HttpParams().set('userId', userId);
  
    return this.http.delete(`${this.apiUrl}/clear`, { 
      params,
      responseType: 'text' // Change response type expectation
    }).pipe(
      tap(() => {
        console.log('API xóa giỏ hàng thành công');
        this.cartItemsSubject.next([]);
      }),
      catchError(error => {
        console.error('Lỗi khi xóa giỏ hàng từ API:', error);
        // Vẫn xóa giỏ hàng ở local để tránh sự không đồng bộ
        this.cartItemsSubject.next([]);
        return throwError(() => error);
      })
    );
  }

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  getTotalQuantity(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Tính tổng giá trị giỏ hàng
  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => 
      total + (item.unit_price * item.quantity), 0
    );
  }
}