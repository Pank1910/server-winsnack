import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { User } from '../../../../my-server-mongodb/interface/User';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';

    private isLoggedInSubject = new BehaviorSubject(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable(); 

    private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    
                    // Lưu thông tin người dùng nếu có
                    if (response.user) {
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        this.currentUserSubject.next(response.user);
                    }
                    
                    this.isLoggedInSubject.next(true);
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
            catchError(error => this.handleError(error))
        );
    }

    checkUser(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getHeaders() }).pipe(
            tap(user => {
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
    }

    // Phương thức để lấy ID người dùng hiện tại
    getCurrentUserId(): string | null {
        const user = this.currentUserSubject.value;
        return user ? user._id : null;
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
        return throwError(() => new Error(error.message || 'Có lỗi xảy ra'));
    }
}