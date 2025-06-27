import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible: boolean = false;
  isLoading: boolean = false;
  error: string = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      profileName: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.error = '';

    const credentials = {
      profileName: this.loginForm.value.profileName,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Kiểm tra role admin
        if (response.user.role !== 'admin') {
          this.error = 'Please login with Admin account!';
          this.authService.logout(); // Đăng xuất ngay vì không phải admin
          return;
        }
        
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        // Đảm bảo cập nhật trạng thái đăng nhập trước khi chuyển hướng
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 100);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message || 'Login failed. Please check your information again.';
      }
    });
}

  get profileName() { return this.loginForm.get('profileName'); }
  get password() { return this.loginForm.get('password'); }
}