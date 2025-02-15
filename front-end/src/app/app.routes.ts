import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component'; 
import { PaymentPageComponent } from './pages/payment/payment.component';
// import { AboutComponent } from './pages/about/about.component';
import { HeaderComponent } from './components/header/header.component';
// import { EventsComponent } from './pages/events/events.component';
import { BlogComponent } from './pages/blog/blog.component';
// import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
// import { CartComponent } from './pages/cart/cart.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    { path: 'payment', component: PaymentPageComponent },
    // { path: 'about', component: AboutComponent },
    { path: 'header', component: HeaderComponent },
    // { path: 'events', component: EventsComponent },
    { path: 'blog', component: BlogComponent },
    // { path: 'contact', component: ContactComponent },
    {path: 'about', component: AboutComponent},
    // {path: 'cart', component: CartComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},


    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect mặc định
    { path: '**', redirectTo: 'home' } // Xử lý route không tồn tại
  ];
  