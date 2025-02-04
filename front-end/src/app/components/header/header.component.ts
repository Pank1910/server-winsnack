import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showAllProducts = false;
  showAbout = false;
  
  // Xử lý toggle cho mobile
  // toggleDropdown(dropdown: string) {
  //   if(window.innerWidth < 768) {
  //     this[dropdown] = !this[dropdown];
  //   }
  // }
}
