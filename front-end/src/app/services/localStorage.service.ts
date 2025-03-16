import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  favorites$ = this.favoritesSubject.asObservable();
  
  constructor() {
    this.loadFavorites();
  }
  
  // Tải danh sách yêu thích từ localStorage
  private loadFavorites(): void {
    const favoritesStr = localStorage.getItem('favoriteProducts');
    const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
    this.favoritesSubject.next(favorites);
  }
  
  // Thêm sản phẩm vào danh sách yêu thích
  addToFavorites(productId: string): void {
    const currentFavorites = this.favoritesSubject.value;
    if (!currentFavorites.includes(productId)) {
      const updatedFavorites = [...currentFavorites, productId];
      localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
      this.favoritesSubject.next(updatedFavorites);
    }
  }
  
  // Xóa sản phẩm khỏi danh sách yêu thích
  removeFromFavorites(productId: string): void {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(id => id !== productId);
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    this.favoritesSubject.next(updatedFavorites);
  }
  
  // Kiểm tra sản phẩm có trong danh sách yêu thích không
  isFavorite(productId: string): boolean {
    return this.favoritesSubject.value.includes(productId);
  }
  
  // Lấy số lượng sản phẩm yêu thích
  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }
  
  // Lấy toàn bộ danh sách ID sản phẩm yêu thích
  getFavoriteIds(): string[] {
    return [...this.favoritesSubject.value];
  }
  
  // Đồng bộ danh sách yêu thích từ tài khoản người dùng (sau khi đăng nhập)
  syncFavoritesFromAccount(favoriteIds: string[]): void {
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteIds));
    this.favoritesSubject.next(favoriteIds);
  }
  
  // Xóa toàn bộ danh sách yêu thích
  clearFavorites(): void {
    localStorage.removeItem('favoriteProducts');
    this.favoritesSubject.next([]);
  }
}