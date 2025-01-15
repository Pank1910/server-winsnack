import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule
import { AppComponent } from './app.component';

// Import các trang mới
import { HomepageComponent } from './pages/homepage/homepage.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Thêm AppRoutingModule vào imports
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
