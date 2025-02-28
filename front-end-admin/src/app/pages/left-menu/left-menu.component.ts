import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Đảm bảo import CommonModule nếu sử dụng các chỉ thị Angular như ngIf, ngFor
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-left-menu',
  standalone: true,  // Nếu component này là standalone component
  imports: [CommonModule, RouterModule],  // Thêm CommonModule vào imports nếu sử dụng các chỉ thị Angular
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent {
  isProductMenuOpen = false;

  constructor(private router: Router) {}

  toggleProductMenu() {
    this.isProductMenuOpen = !this.isProductMenuOpen;
  }

  onLogout() {
    // Xử lý đăng xuất ở đây
    console.log('Đang đăng xuất...');
    // Chuyển hướng đến trang đăng nhập
    this.router.navigate(['/login']);
  }
}
