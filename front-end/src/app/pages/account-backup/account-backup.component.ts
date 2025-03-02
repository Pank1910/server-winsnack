import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AddressesComponent } from './addresses/addresses.component';
// import { AccountInfoComponent } from './account-info/account-info.component';

@Component({
  selector: 'account-backup',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OrderHistoryComponent,
    ReviewsComponent,
    AddressesComponent,
    // AccountInfoComponent
  ],
  templateUrl: './account-backup.component.html',
  styleUrls: ['./account-backup.component.css']
})
export class AccountBackupComponent implements OnInit {
  activeSection: string = 'account-info';
  currentUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Theo dõi thay đổi URL để xác định section đang active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveSection();
    });

    // Xác định section ban đầu
    this.updateActiveSection();
  }

  private updateActiveSection() {
    this.currentUrl = this.router.url;
    
    // Xác định section từ URL
    if (this.currentUrl.includes('orders')) {
      this.activeSection = 'order-history';
      this.scrollToSection('order-history');
    } else if (this.currentUrl.includes('reviews')) {
      this.activeSection = 'reviews';
      this.scrollToSection('reviews');
    } else if (this.currentUrl.includes('addresses')) {
      this.activeSection = 'addresses';
      this.scrollToSection('addresses');
    } else {
      this.activeSection = 'account-info';
      this.scrollToSection('account-info');
    }
  }

  private scrollToSection(sectionId: string) {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  shouldShowSection(sectionId: string): boolean {
    // Hiển thị tất cả các section đồng thời, hoặc có thể logic để hiển thị theo URL
    return true;
    
    // Alternative: only show the active section
    // return this.activeSection === sectionId;
  }
}