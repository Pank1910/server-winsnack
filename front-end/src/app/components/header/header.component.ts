import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) { }
  showAllProducts = false;
  showAbout = false;

  header = {
    favorites: { number: 1 },
    cart: { number: 2 },
    price: 35000,
  };

  toggleShowAllProducts(): void {
    this.showAllProducts = !this.showAllProducts;
  }

  toggleShowAbout(): void {
    this.showAbout = !this.showAbout;
  }

  
  // Xử lý toggle cho mobile
  // toggleDropdown(dropdown: string) {
  //   if(window.innerWidth < 768) {
  //     this[dropdown] = !this[dropdown];
  //   }
  // }
}
