import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../../../my-server-mongodb/interface/User';
import { catchError, tap, retry } from 'rxjs/operators';

// Định nghĩa kiểu cho địa chỉ
type UserAddress = Pick<User, 'profileName' | 'phone' | 'address'>;

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:5000/addresses'; // URL API của bạn
  private readonly STORAGE_KEY = 'userAddress';
  private readonly DEFAULT_ADDRESS: UserAddress = {
    profileName: 'Chưa có địa chỉ',
    phone: '',
    address: 'Vui lòng thêm địa chỉ giao hàng'
  };

  constructor(private http: HttpClient) {}

  // Lấy địa chỉ mặc định từ localStorage
  getDefaultAddress(): UserAddress {
    try {
      const storedAddress = localStorage.getItem(this.STORAGE_KEY);
      return storedAddress ? JSON.parse(storedAddress) : this.DEFAULT_ADDRESS;
    } catch (error) {
      console.error('Lỗi khi đọc địa chỉ từ localStorage:', error);
      return this.DEFAULT_ADDRESS;
    }
  }

  // Lưu địa chỉ vào localStorage
  private saveAddressToStorage(address: UserAddress): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(address));
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ vào localStorage:', error);
    }
  }

  // Lấy địa chỉ người dùng từ server
  getUserAddress(userId: string): Observable<UserAddress> {
    if (!userId) {
      console.error('Thiếu userId khi lấy địa chỉ người dùng');
      return of(this.getDefaultAddress());
    }
    
    const params = new HttpParams().set('userId', userId);

    return this.http.get<UserAddress>(`${this.apiUrl}/user`, { params })
      .pipe(
        retry(2), // Thử lại tối đa 2 lần nếu có lỗi
        tap(address => {
          this.saveAddressToStorage(address);
          console.log('Đã lấy địa chỉ người dùng:', address);
        }),
        catchError(error => {
          console.error('Lỗi khi lấy địa chỉ:', error);
          // Trả về địa chỉ từ localStorage hoặc mặc định nếu có lỗi
          return of(this.getDefaultAddress());
        })
      );
  }

  // Cập nhật địa chỉ người dùng
  updateAddress(userId: string, addressData: UserAddress): Observable<UserAddress> {
    if (!userId) {
      console.error('Thiếu userId khi cập nhật địa chỉ');
      return of(addressData);
    }

    return this.http.put<UserAddress>(`${this.apiUrl}/update`, {
      userId,
      ...addressData
    }).pipe(
      tap(updatedAddress => {
        this.saveAddressToStorage(updatedAddress);
        console.log('Đã cập nhật địa chỉ:', updatedAddress);
      }),
      catchError(error => {
        console.error('Lỗi khi cập nhật địa chỉ:', error);
        
        // Vẫn lưu vào localStorage để có thể làm việc offline
        this.saveAddressToStorage(addressData);
        
        return of(addressData);
      })
    );
  }
}