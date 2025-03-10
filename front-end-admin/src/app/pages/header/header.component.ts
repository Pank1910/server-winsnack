import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isNotificationOpen = false;
  isLoggedIn = false; // Mặc định chưa đăng nhập

  account = {
    name: '',
    images: 'assets/images/header/default-avatar.png' // Ảnh mặc định
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  // Kiểm tra trạng thái đăng nhập
  checkLoginStatus(): void {
    // Giả lập kiểm tra từ localStorage hoặc API
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.isLoggedIn = true;
      this.account.name = user.name;
      this.account.images = user.profileImage || this.account.images;
    }
  }

  toggleNotifications(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
