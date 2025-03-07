import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountInfoComponent } from './account-info/account-info.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AddressesComponent } from './addresses/addresses.component';

@Component({
  selector: 'account-backup',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AccountInfoComponent,
    OrderHistoryComponent,
    ReviewsComponent,
    AddressesComponent
  ],
  templateUrl: './account-backup.component.html',
  styleUrls: ['./account-backup.component.css']
})
export class AccountBackupComponent {
  activeSection: string = 'account-info';

  scrollToSection(sectionId: string) {
    this.activeSection = sectionId;
    
    // Tìm phần tử section
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Cuộn đến section mà không làm thay đổi vị trí của sidebar
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }
}