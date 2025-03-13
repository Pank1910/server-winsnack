import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isNotificationOpen = false;
  hasAvatar = false;
  
  account = {
    name: 'Admin',
    images: 'assets/images/header/account-image.png',
  };
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }
  
  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.account.name = currentUser.profileName || 'Admin';
      
      // Kiểm tra xem có avatar hay không
      if (currentUser.avatar && currentUser.avatar !== '') {
        this.account.images = currentUser.avatar;
        this.hasAvatar = true;
      } else {
        this.hasAvatar = false;
        // Không cần set default image vì chúng ta sẽ hiển thị chữ cái đầu thay thế
      }
    }
  }

  // Phương thức để lấy chữ cái đầu tiên của tên người dùng
  getFirstLetter(): string {
    if (this.account.name && this.account.name.length > 0) {
      return this.account.name.charAt(0).toUpperCase();
    }
    return 'A'; // Mặc định nếu không có tên
  }

  // Phương thức chuyển hướng đến trang account
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
}