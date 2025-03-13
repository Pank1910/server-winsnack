import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ProductDetailComponent } from './pages/product/product-detail/product-detail.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { UpdateProductComponent } from './pages/product/update-product/update-product.component';
import { ProductCategoryComponent } from './pages/product-category/product-category.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { importProvidersFrom } from '@angular/core';
import { AccountComponent } from './pages/account/account.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { SalesorderComponent } from './pages/salesorder/salesorder.component';
import { OrderDetailComponent } from './pages/salesorder/order-detail/order-detail.component';
import { PromotionComponent } from './pages/promotion/promotion.component'

import { AdminGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

// Các route cần bảo vệ
    { path: 'home', component: HomeComponent, canActivate: [AdminGuard] },
    { path: 'account', component: AccountComponent, canActivate: [AdminGuard] },
    { path: 'customer', component: CustomerComponent, canActivate: [AdminGuard] },
    { path: 'salesorder', component: SalesorderComponent, canActivate: [AdminGuard] },
    { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AdminGuard] },
    { path: 'promotion', component: PromotionComponent, canActivate: [AdminGuard] },
    { path: 'blog-list', component: BlogComponent, canActivate: [AdminGuard] },
    { path: 'product-list', component: ProductComponent, canActivate: [AdminGuard] },
    { path: 'product-detail/:id', component: ProductDetailComponent, canActivate: [AdminGuard] },
    { path: 'add-product', component: AddProductComponent, canActivate: [AdminGuard] },
    { path: 'update-product/:id', component: UpdateProductComponent, canActivate: [AdminGuard] },
    { path: 'product-category', component: ProductCategoryComponent, canActivate: [AdminGuard] },
    { path: 'new-category', component: NewCategoryComponent, canActivate: [AdminGuard] },
    { path: 'update-category/:id', component: UpdateCategoryComponent, canActivate: [AdminGuard] },

    // { path: '', redirectTo: '/products', pathMatch: 'full' }, // Mặc định chuyển đến danh sách sản phẩm
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Mặc định về trang home
    { path: '**', redirectTo: '/home' } // Xử lý route không tồn tại
];
