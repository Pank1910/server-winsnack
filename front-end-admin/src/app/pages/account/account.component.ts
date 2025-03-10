import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserData {
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  smsNumber?: string;
  smsNotifications?: boolean;
  language?: string;
  currency?: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // Thông tin người dùng
  userData: UserData = {
    name: 'Linh Linh',
    role: 'Admin 1',
    email: 'khanhlinh@gmail.com',
    phone: '0123456789',
    image: '/api/placeholder/96/96',
    smsNotifications: true,
    language: 'Tiếng Việt',
    currency: 'Việt Nam đồng'
  };

  // Bản sao thông tin người dùng để chỉnh sửa
  editedUserData: UserData = { ...this.userData };

  // Các trạng thái chỉnh sửa
  isEditingProfile: boolean = false;
  isEditingPassword: boolean = false;
  isEditingSMS: boolean = false;
  isEditingLanguage: boolean = false;
  isEditingCurrency: boolean = false;

  // Thông tin mật khẩu
  newPassword: string = '';
  confirmPassword: string = '';

  // Tham chiếu đến file input cho việc tải ảnh lên
  fileInput!: HTMLInputElement;

  constructor() {}

  ngOnInit(): void {
    // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu người dùng từ một dịch vụ
    this.loadUserData();
    // Tạo input file ẩn để chọn ảnh
    this.createFileInput();
  }

  loadUserData(): void {
    // Đây thường sẽ là một cuộc gọi đến dịch vụ người dùng
    // Hiện tại chúng ta sử dụng dữ liệu cứng
    console.log('User data loaded');
  }

  // Tạo input file ẩn để chọn ảnh
  createFileInput(): void {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    
    // Xử lý sự kiện khi người dùng chọn file
    this.fileInput.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        // Đọc file và chuyển đổi thành URL
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            // Cập nhật ảnh đại diện
            this.userData.image = e.target.result as string;
            console.log('Profile image updated');
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    document.body.appendChild(this.fileInput);
  }

  // Mở hộp thoại chọn file để cập nhật ảnh đại diện
  updateProfileImage(): void {
    this.fileInput.click();
  }

  // Bắt đầu chỉnh sửa hồ sơ
  editProfile(): void {
    this.isEditingProfile = true;
    // Tạo bản sao của dữ liệu người dùng để chỉnh sửa
    this.editedUserData = { ...this.userData };
  }

  // Lưu các thay đổi đối với hồ sơ
  saveProfile(): void {
    // Trong ứng dụng thực tế, bạn sẽ gửi dữ liệu đã chỉnh sửa đến API
    this.userData = { ...this.editedUserData };
    this.isEditingProfile = false;
    console.log('Profile updated', this.userData);
  }

  // Hủy việc chỉnh sửa hồ sơ
  cancelEdit(): void {
    this.isEditingProfile = false;
  }

  // Bật/tắt chỉnh sửa mật khẩu
  togglePasswordEdit(): void {
    this.isEditingPassword = !this.isEditingPassword;
    if (!this.isEditingPassword) {
      // Xóa mật khẩu khi hủy chỉnh sửa
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  // Lưu mật khẩu mới
  savePassword(): void {
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      // Trong ứng dụng thực tế, bạn sẽ gửi mật khẩu mới đến API
      console.log('Password updated');
      this.isEditingPassword = false;
      this.newPassword = '';
      this.confirmPassword = '';
    } else {
      alert('Mật khẩu không khớp hoặc không hợp lệ!');
    }
  }

  // Hủy việc chỉnh sửa mật khẩu
  cancelPasswordEdit(): void {
    this.isEditingPassword = false;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Bật/tắt chỉnh sửa SMS
  toggleSMSEdit(): void {
    this.isEditingSMS = !this.isEditingSMS;
  }

  // Bật/tắt chỉnh sửa ngôn ngữ
  toggleLanguageEdit(): void {
    this.isEditingLanguage = !this.isEditingLanguage;
  }

  // Bật/tắt chỉnh sửa đơn vị tiền tệ
  toggleCurrencyEdit(): void {
    this.isEditingCurrency = !this.isEditingCurrency;
  }
}