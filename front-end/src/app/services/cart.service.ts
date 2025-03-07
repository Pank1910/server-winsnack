import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { CartAPIService } from '../cart-api.service';
import { CartItem } from '../../../../my-server-mongodb/interface/Cart';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';


export interface RecommendedProduct {
  productId: string;
  title: string;
  price: number;
  imgbase64_reduce: string;
}


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cartItems_guest';
  private selectedItemsKey = 'selectedItems_guest';


  private cartItems = new BehaviorSubject<
    (CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[]
  >([]);
  cartItems$ = this.cartItems.asObservable();


  private cartItemsCount = new BehaviorSubject<number>(0);
  cartItemsCount$ = this.cartItemsCount.asObservable();


  private isUserLoggedIn = false;
  private userId: string = "123456"; // Hardcode userId = "123456" để test


  constructor(
    private cartAPIService: CartAPIService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    console.log('CartService initialized with userId:', this.userId);
    this.loadCartFromDatabase();
  }


  private getCartItemsFromSessionStorage(): (CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[] {
    const compressedItems = sessionStorage.getItem(this.cartKey);
    const items = compressedItems ? JSON.parse(decompressFromUTF16(compressedItems)) : [];
    return items.map((item: any) => ({
      ...item,
      userId: item.userId ?? 'guest',
      product_name: item.product_name ?? 'Unknown Product',
      image_1: item.image_1 ?? 'assets/default-image.png',
      stocked_quantity: item.stocked_quantity ?? 0,
      tempQuantity: item.tempQuantity ?? item.quantity,
      isSelected: item.isSelected ?? true,
    }));
  }


  private saveCartItemsToSessionStorage(cartItems: (CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[]): void {
    try {
      const serializedData = JSON.stringify(cartItems);
      const compressedData = compressToUTF16(serializedData);
      if (compressedData.length > 5000000) {
        alert('Không thể lưu giỏ hàng vì dữ liệu quá lớn.');
        return;
      }
      sessionStorage.setItem(this.cartKey, compressedData);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      alert('Lỗi khi lưu dữ liệu vào sessionStorage. Vui lòng thử lại.');
    }
  }


  private updateCartCount(cartItems: (CartItem & { product_name: string; image_1: string; stocked_quantity: number })[]): void {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemsCount.next(totalCount);
  }


  getCartItems(): Observable<(CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[]> {
    return this.cartItems$;
  }


  addToCart(
    productId: string,
    quantity: number = 1,
    unit_price: number,
    product_name: string,
    image_1: string,
    stocked_quantity: number
  ): void {
    if (this.userId) {
      this.cartAPIService
        .addToCart(this.userId, productId, quantity, unit_price)
        .pipe(
          tap(() => this.loadCartFromDatabase()),
          catchError((error) => {
            console.error('Error adding to cart:', error);
            return throwError(() => new Error('Error adding to cart: ' + error.message));
          })
        )
        .subscribe();
    } else {
      const cartItems = this.getCartItemsFromSessionStorage();
      const existingItem = cartItems.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.tempQuantity = existingItem.quantity;
      } else {
        cartItems.push({
          userId: this.userId,
          productId,
          quantity,
          unit_price,
          product_name,
          image_1,
          stocked_quantity,
          tempQuantity: quantity,
          isSelected: true,
        });
      }
      this.saveCartItemsToSessionStorage(cartItems);
      this.cartItems.next(cartItems);
      this.updateCartCount(cartItems);
    }
  }


  removeFromCart(productId: string): Observable<any> {
    if (this.userId) {
      return this.cartAPIService.removeFromCart(this.userId, productId).pipe(
        tap(() => this.loadCartFromDatabase()),
        catchError((error) => throwError(() => new Error('Error removing from cart: ' + error.message)))
      );
    } else {
      const cartItems = this.getCartItemsFromSessionStorage().filter((item) => item.productId !== productId);
      this.saveCartItemsToSessionStorage(cartItems);
      this.cartItems.next(cartItems);
      this.updateCartCount(cartItems);
      return of(null);
    }
  }


  updateQuantity(productId: string, tempQuantity: number): Observable<any> {
    if (this.userId) {
      return this.cartAPIService.updateQuantity(this.userId, productId, tempQuantity).pipe(
        tap(() => this.loadCartFromDatabase()),
        catchError((error) => throwError(() => new Error('Error updating quantity: ' + error.message)))
      );
    } else {
      const cartItems = this.getCartItemsFromSessionStorage();
      const item = cartItems.find((item) => item.productId === productId);
      if (item) {
        item.quantity = tempQuantity;
        item.tempQuantity = tempQuantity;
      }
      this.saveCartItemsToSessionStorage(cartItems);
      this.cartItems.next(cartItems);
      this.updateCartCount(cartItems);
      return of(null);
    }
  }


  updateCartItems(cartItems: (CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[]): Observable<any> {
    if (this.userId) {
      const itemsToUpdate = cartItems.map(item => ({
        productId: item.productId!,
        quantity: item.tempQuantity,
        unit_price: item.unit_price,
      }));
      return this.cartAPIService.updateCartItems(this.userId, itemsToUpdate).pipe(
        tap(() => this.loadCartFromDatabase()),
        catchError((error) => throwError(() => new Error('Error updating cart items: ' + error.message)))
      );
    } else {
      const updatedItems = cartItems.map(item => ({
        ...item,
        quantity: item.tempQuantity,
      }));
      this.saveCartItemsToSessionStorage(updatedItems);
      this.cartItems.next(updatedItems);
      this.updateCartCount(updatedItems);
      return of(null);
    }
  }


  saveSelectedItems(selectedItems: (CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[]): Observable<any> {
    const itemsToSave = selectedItems.map(item => ({
      userId: this.userId,
      productId: item.productId!,
      quantity: item.tempQuantity,
      unit_price: item.unit_price,
      product_name: item.product_name,
      image_1: item.image_1,
      stocked_quantity: item.stocked_quantity,
      isSelected: item.isSelected ?? true, // Đảm bảo isSelected có giá trị
    }));


    if (this.userId) {
      return this.cartAPIService.saveSelectedItems(this.userId, itemsToSave).pipe(
        catchError((error) => throwError(() => new Error('Error saving selected items: ' + error.message)))
      );
    } else {
      const serializedData = JSON.stringify(itemsToSave);
      const compressedData = compressToUTF16(serializedData);
      if (compressedData.length > 5000000) {
        alert('Không thể lưu dữ liệu vì kích thước quá lớn.');
        return of(null);
      }
      localStorage.setItem(this.selectedItemsKey, compressedData);
      return of(null);
    }
  }


  getRecommendedProducts(): Observable<RecommendedProduct[]> {
    return this.http.get<RecommendedProduct[]>('http://localhost:5000/recommended-products').pipe(
      catchError(() => of([
        { productId: '1', title: 'Snack A', price: 20000, imgbase64_reduce: 'assets/snack-a.png' },
        { productId: '2', title: 'Snack B', price: 15000, imgbase64_reduce: 'assets/snack-b.png' },
      ]))
    );
  }


  public loadCartFromDatabase(): void {
    console.log('Loading cart for userId:', this.userId);
    this.cartAPIService
      .getCartItems(this.userId)
      .pipe(
        tap((response: any) => {
          console.log('Raw response from API:', response); // Debug raw response
          let cartItems = response;
          // Kiểm tra nếu API trả về dạng { success: true, data: [...] }
          if (response && response.success && Array.isArray(response.data)) {
            cartItems = response.data;
          }
          console.log('Cart items extracted:', cartItems); // Debug extracted items
          if (cartItems && cartItems.length > 0) {
            const mappedItems = cartItems.map((item: any) => ({
              ...item,
              product_name: item.product_name ?? 'Tên sản phẩm',
              image_1: item.image_1 ?? 'default-image.jpg',
              stocked_quantity: item.stocked_quantity ?? 0,
              tempQuantity: item.quantity ?? 1,
              isSelected: item.isSelected ?? true,
            }));
            console.log('Mapped cart items:', mappedItems);
            this.cartItems.next(mappedItems);
          } else {
            console.log('No cart items found for userId:', this.userId);
            this.cartItems.next([]);
          }
        }),
        catchError((error) => {
          console.error('Error loading cart:', error);
          this.cartItems.next([]);
          return throwError(() => new Error('Error loading cart from database: ' + error.message));
        })
      )
      .subscribe();
  }


  private mergeLocalCartToDatabase(localItems: (CartItem & { product_name: string; image_1: string; stocked_quantity: number; tempQuantity: number; isSelected: boolean })[]): void {
    localItems.forEach(item => {
      this.cartAPIService
        .addToCart(this.userId, item.productId!, item.quantity, item.unit_price)
        .subscribe();
    });
    sessionStorage.removeItem(this.cartKey);
  }


  clearCart(): Observable<any> {
    if (this.userId) {
      return this.cartAPIService.clearCart(this.userId).pipe(
        tap(() => {
          this.cartItems.next([]);
          this.updateCartCount([]);
        }),
        catchError((error) => throwError(() => new Error('Error clearing cart: ' + error.message)))
      );
    } else {
      sessionStorage.removeItem(this.cartKey);
      this.cartItems.next([]);
      this.updateCartCount([]);
      return of(null);
    }
  }
}

