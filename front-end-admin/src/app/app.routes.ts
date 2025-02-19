import { Routes } from '@angular/router';
// import { HomepageComponent } from './pages/homepage/homepage.component'; 

export const routes: Routes = [
    // { path: 'home', component: HomepageComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect mặc định
    { path: '**', redirectTo: 'home' } // Xử lý route không tồn tại
];
