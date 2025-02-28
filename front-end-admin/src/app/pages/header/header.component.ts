import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isNotificationOpen = false;
  
  account = {
    name: 'Admin101',
    images: 'assets/images/header/account-image.png' // Default path, update as needed
  };

  constructor() { }

  ngOnInit(): void {
    // You can fetch the user account info here if needed
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // This method would fetch user data from a service
    // Example implementation:
    /*
    this.userService.getCurrentUser().subscribe(
      (userData) => {
        this.account.name = userData.name;
        this.account.images = userData.profileImage || this.account.images;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
    */
  }

  toggleNotifications(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  // Handle clicking outside to close notifications
  closeNotifications(event: Event): void {
    if (!(event.target as HTMLElement).closest('.notification-trigger')) {
      this.isNotificationOpen = false;
    }
  }
}