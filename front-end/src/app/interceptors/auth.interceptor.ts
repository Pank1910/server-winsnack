import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  
  // Lấy token từ localStorage
  const token = localStorage.getItem('token');
  
  // Nếu có token, thêm vào header
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    // Trả về request đã được chỉnh sửa
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // Nếu lỗi 401 Unauthorized, chuyển hướng đến trang đăng nhập
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};