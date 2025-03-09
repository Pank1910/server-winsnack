import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  canActivateAdmin(): Observable<boolean> {
    // Kiểm tra xem người dùng có phải admin không
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.authService.checkUser().pipe(
      map(user => {
        const isAdmin = user.role === 'admin';
        if (!isAdmin) {
          this.router.navigate(['/home']);
        }
        return isAdmin;
      }),
      catchError(error => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}