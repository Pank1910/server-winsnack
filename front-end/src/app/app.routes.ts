import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component'; 
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AllBlogsComponent } from './components/all-blogs/all-blogs.component';
import { ReadBlogComponent } from './components/read-blog/read-blog.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductDetailBackupComponent } from './pages/product-detail-backup/product-detail-backup.component';
import { AccountBackupComponent } from './pages/account-backup/account-backup.component';

// import { EventsComponent } from './pages/events/events.component';
// import { ContactComponent } from './pages/contact/contact.component';
// import { AccountComponent } from './pages/account/account.component';
// import { MinigameComponent } from './pages/minigame/minigame.component';
// import { PaymentPageComponent } from './pages/payment/payment.component';
import { ProductCategoryComponent } from './pages/product-category/product-category.component';
// import { TermsAndPoliciesComponent } from './pages/terms-and-policies/terms-and-policies.component';

export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    { path: 'about', component: AboutComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'all-blogs', component: AllBlogsComponent },
    { path: 'read-blog', component: ReadBlogComponent },
    { path: 'header', component: HeaderComponent },
    { path: 'footer', component: FooterComponent },
    { path: 'cart', component: CartComponent},

  
    // { path: 'terms-and-policies', component:  TermsAndPoliciesComponent},
    // { path: 'account', component: AccountComponent },

    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    // { path: 'payment', component: PaymentPageComponent },
    // { path: 'events', component: EventsComponent },
    // { path: 'contact', component: ContactComponent },
    // { path: 'account', component: AccountComponent },
    // { path: 'minigame', component: MinigameComponent },
    { path: 'product-category', component: ProductCategoryComponent },
    { path: 'product-detail', component: ProductDetailBackupComponent },
    { path: 'account', component: AccountBackupComponent },


    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect mặc định
    { path: '**', redirectTo: 'home' } // Xử lý route không tồn tại
];


