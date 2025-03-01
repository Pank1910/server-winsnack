// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { AppComponent } from './app.component';
// import { FormsModule } from '@angular/forms'; // Nhập FormsModule
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';


// // Import các component
// import { HomepageComponent } from './pages/homepage/homepage.component';
// import { PaymentPageComponent } from './pages/payment/payment.component';
// import { ProductCategoryComponent } from './pages/product-category/product-category.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     HomepageComponent,        // Thêm HomepageComponent vào declarations
//     PaymentPageComponent,     // Thêm PaymentPageComponent vào declarations
//     ProductCategoryComponent  // Thêm ProductCategoryComponent vào declarations
//   ],
//   imports: [
//     CommonModule,
//     BrowserModule,
//     FormsModule,  // Thêm FormsModule vào imports để sử dụng ngModel
//     RouterModule.forRoot([ // Cấu hình Routing
//       { path: '', redirectTo: 'home', pathMatch: 'full' },
//       { path: 'home', component: HomepageComponent },
//       { path: 'payment', component: PaymentPageComponent },
//       { path: 'product-category', component: ProductCategoryComponent },
//       { path: '**', redirectTo: 'home' }
//     ])
//   ],
//   providers: [],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}
// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { AppComponent } from './app.component';
import { CartComponent } from './pages/cart/cart.component';
import { RouterModule } from '@angular/router';
import { ProductDetailBackupComponent } from './pages/product-detail-backup/product-detail-backup.component';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    ProductDetailBackupComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,  // Đảm bảo HttpClientModule được thêm vào
    RouterModule.forRoot([]),  // Đảm bảo RouterModule được cấu hình
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
