import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  // Các biến để lưu trữ dữ liệu người dùng nhập vào
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';

  // Phương thức để xử lý khi người dùng gửi form
  onSubmit() {
    // Kiểm tra dữ liệu nhập vào
    if (this.name && this.email && this.phone && this.message) {
      // Giả lập gửi thông tin (có thể gọi API hoặc xử lý theo yêu cầu)
      console.log('Thông tin đã gửi:', {
        name: this.name,
        email: this.email,
        phone: this.phone,
        message: this.message
      });

      // Reset form sau khi gửi
      this.name = '';
      this.email = '';
      this.phone = '';
      this.message = '';

      // Thông báo thành công
      alert('Cảm ơn bạn đã gửi thông tin, chúng tôi sẽ phản hồi sớm!');
    } else {
      // Thông báo lỗi nếu thông tin chưa đủ
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
}
