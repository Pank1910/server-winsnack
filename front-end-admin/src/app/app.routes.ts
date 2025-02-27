import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ProductDetailComponent } from './pages/product/product-detail/product-detail.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { UpdateProductComponent } from './pages/product/update-product/update-product.component';


export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

    { path: 'blog-list', component: BlogComponent },
    { path: 'product-list', component: ProductComponent },
    { path: 'product-detail/:id', component: ProductDetailComponent }, // Route với productId
    { path: 'add-product', component: AddProductComponent },
    { path: 'update-product/:id', component: UpdateProductComponent }, // Route cập nhật sản phẩm
    { path: '', redirectTo: '/products', pathMatch: 'full' }, // Mặc định chuyển đến danh sách sản phẩm
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Mặc định về trang home
    { path: '**', redirectTo: '/home' } // Xử lý route không tồn tại

    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect mặc định
    { path: '**', redirectTo: 'home' } // Xử lý route không tồn tại

];
