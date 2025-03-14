import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftMenuComponent } from './pages/left-menu/left-menu.component';
import { HeaderComponent } from './pages/header/header.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeftMenuComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'front-end-admin';
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Theo dõi trạng thái đăng nhập
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }
}