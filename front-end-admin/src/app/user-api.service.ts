import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../../my-server-mongodb/interface/User';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private API_URL = 'http://localhost:5000'; // Chỉ giữ base URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No token found in localStorage');
    }
    return headers;
  }

  getUserProfile(userId: string): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('userId is required'));
    }
    return this.http.get(`${this.API_URL}/profile-admin?userId=${userId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/update-profile`, userData, { headers: this.getHeaders() });
  }

  uploadAvatar(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(`${this.API_URL}/upload-avatar`, formData, { headers });
  }

  updatePassword(userId: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.API_URL}/update-password`, { userId, newPassword }, { headers: this.getHeaders() });
  }
}