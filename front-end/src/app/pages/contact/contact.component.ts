import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  showPopup: boolean = false; // Biến kiểm soát popup

  constructor(private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault(); // Ngăn chặn reload trang

    if (this.name && this.email && this.phone && this.message) {
      console.log('Thông tin đã gửi:', {
        name: this.name,
        email: this.email,
        phone: this.phone,
        message: this.message
      });

      // Hiển thị popup
      this.showPopup = true;
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
}
