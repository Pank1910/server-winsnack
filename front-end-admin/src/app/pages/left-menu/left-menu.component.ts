import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Để sử dụng các chỉ thị như *ngIf, ngClass
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-left-menu',
  standalone: true, // Component này là standalone
  imports: [CommonModule, RouterModule], // Thêm CommonModule và RouterModule vào imports
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
    // Hiển thị bảng xác nhận
    const confirmLogout = window.confirm('Bạn có muốn đăng xuất khỏi tài khoản không?');
    
    if (confirmLogout) {
      // Xử lý đăng xuất ở đây (nếu cần)
      console.log('Đang đăng xuất...');
      
      // Ví dụ: Xóa token hoặc dữ liệu phiên đăng nhập (nếu có)
      // localStorage.removeItem('authToken');

      // Chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
    } else {
      // Nếu người dùng chọn "Không", không làm gì cả
      console.log('Hủy đăng xuất');
    }
  }
}