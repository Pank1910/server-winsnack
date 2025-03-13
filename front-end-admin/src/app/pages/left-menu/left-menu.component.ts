import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-left-menu',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent {
  isProductMenuOpen = false;

  constructor(private router: Router,
    private authService: AuthService
  ) {}

  toggleProductMenu() {
    this.isProductMenuOpen = !this.isProductMenuOpen;
  }

  onLogout() {
    const confirmLogout = window.confirm('Bạn có muốn đăng xuất khỏi tài khoản không?');
    
    if (confirmLogout) {
      console.log('Đang đăng xuất...');
   
      this.authService.logout();
      
    } else {
      console.log('Hủy đăng xuất');
    }
  }
}