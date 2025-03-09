import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // ✅ Cung cấp HttpClient
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()] // ✅ Thêm `provideHttpClient()`
}).catch(err => console.error(err));
