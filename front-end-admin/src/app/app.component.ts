import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftMenuComponent } from './pages/left-menu/left-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LeftMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end-admin';
}
