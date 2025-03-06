import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserAddress {
  profileName: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:5000/addresses'; // URL API của bạn

  constructor(private http: HttpClient) {}

  // Lấy địa chỉ mặc định của người dùng
  getDefaultAddress(): UserAddress {
    // Đọc từ localStorage hoặc trả về địa chỉ mặc định
    const storedAddress = localStorage.getItem('userAddress');
    return storedAddress ? JSON.parse(storedAddress) : {
      profileName: 'Chưa có địa chỉ',
      phone: '',
      address: 'Vui lòng thêm địa chỉ giao hàng'
    };
  }

  // Lấy địa chỉ người dùng từ server
  getUserAddress(userId: string): Observable<UserAddress> {
    return this.http.get<UserAddress>(`${this.apiUrl}/user`, {
      params: { userId: userId }
    });
  }

  // Cập nhật địa chỉ người dùng
  updateAddress(userId: string, addressData: UserAddress): Observable<UserAddress> {
    return this.http.put<UserAddress>(`${this.apiUrl}/update`, {
      userId,
      ...addressData
    });
  }
}