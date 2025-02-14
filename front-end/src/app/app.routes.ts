import { Routes } from '@angular/router';
// import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component'; 
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AllBlogsComponent } from './components/all-blogs/all-blogs.component';
import { ReadBlogComponent } from './components/read-blog/read-blog.component';

// import { AccountComponent } from './pages/account/account.component';
// import { CartComponent } from './pages/cart/cart.component';
// import { MinigameComponent } from './pages/minigame/minigame.component';
// import { PaymentPageComponent } from './pages/payment/payment.component';
// import { ProductCategoryComponent } from './pages/product-category/product-category.component';
// import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    // { path: 'payment', component: PaymentPageComponent },
    { path: 'about', component: AboutComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'header', component: HeaderComponent },
    { path: 'footer', component: FooterComponent },
    // { path: 'account', component: AccountComponent },
    // { path: 'cart', component: CartComponent },
    // { path: 'minigame', component: PaymentPageComponent },
    // { path: 'product-category', component: ProductCategoryComponent },
    // { path: 'product-detail', component: ProductDetailComponent },
    // { path: 'minigame', component: MinigameComponent },
    { path: 'product-category', component: BlogComponent },
    { path: 'all-blogs', component: AllBlogsComponent },
    { path: 'read-blog', component: ReadBlogComponent },


    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect mặc định
    { path: '**', redirectTo: 'home' } // Xử lý route không tồn tại
  ];