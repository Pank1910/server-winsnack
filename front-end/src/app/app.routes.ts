import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component'; 
import { PaymentPageComponent } from './pages/payment/payment.component';

export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    { path: 'payment', component: PaymentPageComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect mặc định
    { path: '**', redirectTo: 'home' } // Xử lý route không tồn tại
  ];