import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { User } from '../../../../my-server-mongodb/interface/User';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5000';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable(); 

    private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { 
        // Kiểm tra trạng thái đăng nhập khi khởi tạo service
        if (this.hasToken()) {
            this.checkUser().subscribe({
                error: () => this.logout()
            });
        }
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // Kiểm tra xem người dùng đã đăng nhập chưa
    isLoggedIn(): boolean {
        return this.isLoggedInSubject.value;
    }

    // Lấy thông tin người dùng hiện tại
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Kiểm tra xem người dùng có phải là admin không
    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return !!user && user.role === 'admin';
    }

    login(credentials: { profileName: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response && response.user) {
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                    this.isLoggedInSubject.next(true);
                }
            }),
            catchError(error => this.handleError(error))
        );
    }
      

    register(userData: { profileName: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => {
                if (response && response.success && response.user) {
                    // Lưu thông tin user và token
                    localStorage.setItem('token', response.token || 'dummy-token'); // Giả định token hoặc dùng dummy token
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                    this.isLoggedInSubject.next(true);
                    
                    // Chuyển hướng đến trang chủ
                    this.router.navigate(['/home']);
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    checkUser(): Observable<User> {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return throwError(() => new Error('Không có thông tin người dùng'));
        }
    
        return this.http.get<User>(`${this.apiUrl}/profile?userId=${currentUser.userId}`).pipe(
            tap(user => {
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            }),
            catchError(error => {
                this.logout();
                return this.handleError(error);
            })
        );
    }    

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
    }

    // Phương thức để lấy ID người dùng hiện tại
    getCurrentUserId(): string | null {
        const user = this.currentUserSubject.value;
        return user ? user.userId : null;
    }

    // Lấy vai trò của người dùng hiện tại
    getUserRole(): string | null {
        const user = this.currentUserSubject.value;
        return user ? user.role : null;
    }

    // Phương thức để lấy thông tin người dùng từ localStorage
    private getCurrentUserFromStorage(): User | null {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('token');
    }

    private handleError(error: any): Observable<never> {
        console.error('Lỗi API:', error);
        
        let errorMessage = 'Có lỗi xảy ra';
        
        if (error.status === 401) {
            errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác';
        } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return throwError(() => new Error(errorMessage));
    }
}