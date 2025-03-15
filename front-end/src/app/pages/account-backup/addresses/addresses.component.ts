import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent {
  phoneNumber: string = '0123456789';
  address: string = 'Sâu thẳm nơi đại dương';
  mapSrc: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.336509723974!2d106.78134937505632!3d10.862176689292305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175276fc1db3d7f%3A0x4358f22a0a462f1!2zS2h1IHBo4buRIEIsIMSQSCBRdeG7kWMgR2lhIEPhuqVu!5e0!3m2!1svi!2s!4v1700000000000'
    );
  }
}