import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './../../../my-server-mongodb/interface/User';

export interface CustomerResponse {
  success: boolean;
  data: User[];
  message?: string;
}

export interface CustomerApiUser {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orderCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private apiUrl = 'http://localhost:5000/api'; // Cập nhật URL để phù hợp với cấu trúc API

  constructor(private http: HttpClient) { }

  // Lấy danh sách khách hàng (users có role='user')
  getCustomers(): Observable<CustomerApiUser[]> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/customers`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapUsersToCustomers(response.data);
          }
          return [];
        })
      );
  }

  /**
   * Chuyển đổi từ model User sang CustomerApiUser
   */
  private mapUsersToCustomers(users: User[]): CustomerApiUser[] {
    return users.map(user => {
      return {
        name: user.profileName,
        email: user.email,
        phone: user.phone || 'Chưa cung cấp',
        address: user.address || 'Chưa cung cấp',
        orderCount: user.orderCount // Sử dụng orderCount từ server trả về
      };
    });
  }

  /**
   * Tìm kiếm khách hàng theo từ khóa và loại tìm kiếm
   */
  searchCustomers(searchTerm: string, searchType: string): Observable<CustomerApiUser[]> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('searchType', searchType);
    
    return this.http.get<CustomerResponse>(`${this.apiUrl}/search-user`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapUsersToCustomers(response.data);
          }
          return [];
        })
      );
  }
}