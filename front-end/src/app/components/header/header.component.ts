import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  showAllProducts = false;
  showAbout = false;
  showUserMenu = false;
  isLoggedIn = false;
  currentUser: any = null;

  header = {
    favorites: { number: 1 },
    cart: { number: 2 },
    price: 35000,
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập ban đầu
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    
    // Đăng ký lắng nghe sự kiện đăng nhập/đăng xuất
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
    });
  }

  toggleShowAllProducts(): void {
    this.showAllProducts = !this.showAllProducts;
  }

  toggleShowAbout(): void {
    this.showAbout = !this.showAbout;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }

  getProfileInitial(): string {
    if (this.currentUser && this.currentUser.profileName) {
      return this.currentUser.profileName.charAt(0).toUpperCase();
    }
    return 'U';
  }
}