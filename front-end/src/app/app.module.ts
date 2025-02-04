import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import các trang mới
import { HomepageComponent } from './pages/homepage/homepage.component';
import { PaymentPageComponent } from './pages/payment/payment.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    // AppRoutingModule, // Thêm AppRoutingModule vào imports
  //   RouterModule.forRoot([ // Cấu hình routing trực tiếp
  //     { path: '', redirectTo: 'home', pathMatch: 'full' },
  //     { path: 'home', component: HomepageComponent },
  //     { path: 'payment', component: PaymentPageComponent },
  //     { path: '**', redirectTo: 'home' }
  //   ]),
  //   HomepageComponent, 
  //   PaymentPageComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
