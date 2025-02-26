import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable theo dõi trạng thái đăng nhập

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
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            catchError(error => this.handleError(error))
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData).pipe(
            catchError(error => this.handleError(error))
        );
    }

    checkUser(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() }).pipe(
            catchError(error => this.handleError(error))
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false); // Cập nhật trạng thái đăng nhập
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('token');
    }

    private handleError(error: any): Observable<never> {
        console.error('Lỗi API:', error);
        return throwError(() => new Error(error.message || 'Có lỗi xảy ra'));
    }
}
