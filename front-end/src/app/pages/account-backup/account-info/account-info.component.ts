import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../../../../my-server-mongodb/interface/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent implements OnInit {
  user: User | null = null;
  isEditing = false;
  editedUser: User | null = null;
  apiUrl = 'http://localhost:5000';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // Đầu tiên, lấy dữ liệu user hiện tại từ AuthService
    this.user = this.authService.getCurrentUser();
    this.editedUser = this.user ? { ...this.user } : null;
    
    // Sau đó đăng ký theo dõi các thay đổi trong tương lai
    this.authService.currentUser$.subscribe(user => {
      console.log('User data received from auth service:', user);
      this.user = user;
      this.editedUser = user ? { ...user } : null;
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.user) {
      // Create a copy for editing
      this.editedUser = { ...this.user };
    }
  }

  saveChanges(): void {
    if (!this.editedUser) return;
    
    const userData = {
      ...this.editedUser,
      userId: this.user?.userId
    };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.get(`${this.apiUrl}/user/${this.editedUser?.userId}`, { headers })
    .subscribe({
      next: (response: any) => {
        if (response && response.user) {
          this.user = response.user;
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.isEditing = false;
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy lại thông tin user:', error);
      }
    });

    this.http.put(`${this.apiUrl}/update-profile`, userData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Server response:', response); // Log để xem cấu trúc phản hồi
          
          // Kiểm tra cấu trúc đúng của response
          if (response && response.success && response.user) {
            // Lưu user data vào localStorage
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Cập nhật service và biến local
            this.authService.updateCurrentUser(response.user);
            this.user = response.user;
            this.isEditing = false;
          }
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật thông tin:', error);
        }
      });
  }

  // Xử lý việc chọn file
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Kiểm tra loại file
      if (!this.selectedFile.type.match(/image\/(jpeg|jpg|png|gif)$/)) {
        alert('Vui lòng chọn file hình ảnh (JPEG, JPG, PNG, GIF)');
        this.selectedFile = null;
        return;
      }
      
      // Giới hạn kích thước file (2MB)
      if (this.selectedFile.size > 2 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 2MB');
        this.selectedFile = null;
        return;
      }
      
      // Tạo preview
      this.createImagePreview();
    }
  }
  
  createImagePreview(): void {
    if (!this.selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result || null;
    };
    reader.readAsDataURL(this.selectedFile);
  }
  
  updateAvatar(): void {
    // Nếu không có file đã chọn, hiển thị dialog chọn file
    if (!this.selectedFile) {
      document.getElementById('avatarFileInput')?.click();
      return;
    }
    
    // Nếu đã có file, tiến hành upload
    this.uploadAvatar();
  }
  
  uploadAvatar(): void {
    if (!this.selectedFile || !this.user?.userId) return;
    
    const formData = new FormData();
    formData.append('avatar', this.selectedFile);
    formData.append('userId', this.user.userId);
    
    this.http.post(`${this.apiUrl}/upload-avatar`, formData)
      .subscribe({
        next: (response: any) => {
          if (response && response.success && response.user) {
            // Cập nhật thông tin user với avatar mới
            this.user = response.user;
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.authService.updateCurrentUser(response.user);
            
            // Reset
            this.selectedFile = null;
            this.previewUrl = null;
            
            alert('Cập nhật ảnh đại diện thành công!');
          }
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật ảnh đại diện:', error);
          alert('Đã xảy ra lỗi khi cập nhật ảnh đại diện');
        }
      });
  }
  
  cancelImageSelection(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  // Helper function to display appropriate text for empty fields
  getDisplayValue(value: string | undefined): string {
    return value && value.trim() !== '' ? value : 'Chưa có thông tin';
  }
}