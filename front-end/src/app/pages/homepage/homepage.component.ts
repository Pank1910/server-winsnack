import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { slideInOutAnimation } from 'src/app/models/slide-in-out.animation';
// import { scaleInOutAnimation } from 'src/app/models/scale-in-out.animation';
// import { fadeInOutAnimation } from 'src/app/models/fade-in-out.animation';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  // animations: [slideInOutAnimation ,scaleInOutAnimation,fadeInOutAnimation,
  // ],

})
export class HomepageComponent {
   constructor(private router: Router) { }

  navigateToEvent() {
    this.router.navigate(['/event']);
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
  }

  navigateToProducts() {
    this.router.navigate(['/product']);
  }

  navigateToBlogs() {
    this.router.navigate(['/blog']);
  }
}