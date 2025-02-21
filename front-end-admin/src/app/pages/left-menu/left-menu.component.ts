// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-left-menu',
//   imports: [],
//   templateUrl: './left-menu.component.html',
//   styleUrl: './left-menu.component.css'
// })
// export class LeftMenuComponent {

// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Đảm bảo import CommonModule nếu sử dụng các chỉ thị Angular như ngIf, ngFor

@Component({
  selector: 'app-left-menu',
  standalone: true,  // Nếu component này là standalone component
  imports: [CommonModule],  // Thêm CommonModule vào imports nếu sử dụng các chỉ thị Angular
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent {

  // Khai báo phương thức onLogout
  onLogout() {
    console.log('Đăng xuất thành công!');
    // Logic đăng xuất có thể là xoá token, thông tin người dùng, hoặc chuyển hướng
    // Ví dụ: localStorage.removeItem('user');
    // Hoặc sử dụng Router để chuyển hướng đến trang login
    // this.router.navigate(['/login']);
  }
}
