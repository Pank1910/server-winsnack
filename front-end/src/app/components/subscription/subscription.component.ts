import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
  email: string = "";
  isPopupVisible: boolean = false;

  onSubmit(event: Event) {
    event.preventDefault(); // Ngăn chặn form gửi đi

    if (this.email.trim()) {
      console.log("Email đã nhập:", this.email); // Debug để kiểm tra giá trị email
      localStorage.setItem("subscribedEmail", this.email); // Lưu email vào localStorage
      this.isPopupVisible = true; // Hiển thị popup
    }
  }

  closePopup() {
    this.isPopupVisible = false; // Ẩn popup
    this.email = ""; // Xóa email sau khi đăng ký
  }
}
