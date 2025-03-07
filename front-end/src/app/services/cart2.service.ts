import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CartItem } from '../../../../my-server-mongodb/interface/Cart';

@Injectable({
  providedIn: 'root'
})
export class Cart2Service {
  private apiUrl = 'http://localhost:5000/cart'; // Điều chỉnh URL API của bạn
  
  // Subject để theo dõi các thay đổi trong giỏ hàng
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Tải giỏ hàng từ server khi khởi tạo service
    this.loadCart();
  }

  // Tải giỏ hàng từ server
  loadCart(): void {
    // Thử các phương án lấy userId
    const userId = 
        localStorage.getItem('userId') || 
        sessionStorage.getItem('userId') || 
        '67c45736fe6efc45001f9ec6';

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
    return this.cartItemsSubject.value.filter(item => item.quantity > 0);
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
  removeFromCart(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(() => {
        const currentItems = this.cartItemsSubject.value;
        const updatedItems = currentItems.filter(item => item.productId !== productId);
        this.cartItemsSubject.next(updatedItems);
      })
    );
  }

  // Xóa toàn bộ giỏ hàng
  clearCart(): void {
    this.http.delete(`${this.apiUrl}/clear`).subscribe(() => {
      this.cartItemsSubject.next([]);
    });
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