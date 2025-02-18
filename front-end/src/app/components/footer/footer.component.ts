import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) { }
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
