import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { User } from './../../../../../my-server-mongodb/interface/User';
import { UserApiService } from '../../user-api.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userData: User = {
    _id: null,
    userId: '',
    profileName: '',
    role: 'admin',
    email: '',
    phone: '',
    avatar: '',
    action: '',
    orderCount: ''
  };

  editedUserData: User = { ...this.userData };
  language: string = 'Vietnamese';
  currency: string = 'Vietnamese Dong';
  smsNotifications: boolean = true;
  sms: string = '';
  isEditingProfile: boolean = false;
  isEditingPassword: boolean = false;
  isEditingSMS: boolean = false;
  isEditingLanguage: boolean = false;
  isEditingCurrency: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  selectedFile: File | null = null;

  constructor(
    private userApiService: UserApiService,
    private cdr: ChangeDetectorRef // Thêm ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('Current User from localStorage:', currentUser);

    if (currentUser && currentUser.userId) {
      this.userData.userId = currentUser.userId;
      console.log('Attempting to load user with ID:', this.userData.userId);
      this.loadUserData();
    } else {
      console.error('No user information found in localStorage');
      alert('VPlease login to view account information!');
      // Có thể thêm redirect tới trang đăng nhập
      // this.router.navigate(['/login']);
    }
  }

  loadUserData(): void {
    this.userApiService.getUserProfile(this.userData.userId).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Log để kiểm tra response từ server
        if (!response.success || !response.user) {
          console.error('Invalid response from API:', response);
          alert('Invalid user data!');
          return;
        }
  
        const user = response.user;
        this.userData = {
          ...this.userData,
          userId: user.userId,
          profileName: user.profileName || '',
          role: user.role || 'admin',
          email: user.email || '',
          phone: user.phone || '',
          avatar: user.avatar || '',
          address: user.address || '',
          marketing: user.marketing || false,
          action: user.action || '' // Load action từ dữ liệu
        };
        this.editedUserData = { ...this.userData };
        this.cdr.detectChanges(); // Buộc cập nhật giao diện
        console.log('Admin user data loaded:', this.userData);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        alert('Unable to load user information: ' + (error.message || 'Unknown error'));
      }
    });
  }

  // Handle file selection for avatar upload
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
      
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // This is just for preview, not saving to DB yet
          this.userData.avatar = e.target.result as string;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Upload and update avatar
  updateProfileImage(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.selectedFile = target.files[0];
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('avatar', this.selectedFile);
        formData.append('userId', this.userData.userId);
        
        // Upload avatar to server
        this.userApiService.uploadAvatar(formData).subscribe({
          next: (response) => {
            if (response.success) {
              // Cập nhật URL avatar từ response
              this.userData.avatar = response.user.avatar;
              
              // Thêm timestamp vào URL để tránh cache
              const timestamp = new Date().getTime();
              if (this.userData.avatar.includes('?')) {
                this.userData.avatar += `&t=${timestamp}`;
              } else {
                this.userData.avatar += `?t=${timestamp}`;
              }
              
              // Buộc Angular cập nhật view
              this.cdr.detectChanges();
              console.log('Avatar updated successfully:', this.userData.avatar);
            }
          },
          error: (error) => {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload image. Please try again.');
          }
        });
      }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  // Thêm phương thức này vào account.component.ts
  getAvatarUrl(): string {
    if (!this.userData.avatar) {
      return '/api/placeholder/96/96';
    }
    
    // Nếu avatar đã là URL đầy đủ
    if (this.userData.avatar.startsWith('http')) {
      return this.userData.avatar;
    }
    

    
    // Thêm base URL vào đường dẫn tương đối
    return 'http://localhost:5000' + this.userData.avatar;
  }

  previewImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.userData.avatar = e.target?.result as string;
        this.cdr.detectChanges();
      };
      
      reader.readAsDataURL(file);
    }
  }

  // Start editing profile
  editProfile(): void {
    this.isEditingProfile = true;
    // Create a copy of user data for editing
    this.editedUserData = { ...this.userData };
  }

  // Save profile changes
  saveProfile(): void {
    // Prepare data for update
    const updatedData = {
      userId: this.editedUserData.userId,
      profileName: this.editedUserData.profileName,
      email: this.editedUserData.email,
      phone: this.editedUserData.phone,
      address: this.editedUserData.address,
      marketing: this.editedUserData.marketing
    };
    
    // Send update to server
    this.userApiService.updateUserProfile(updatedData).subscribe({
      next: (response) => {
        if (response.success) {
          // Update local user data with response from server
          this.userData = { 
            ...this.userData,
            profileName: this.editedUserData.profileName,
            email: this.editedUserData.email,
            phone: this.editedUserData.phone,
            address: this.editedUserData.address,
            marketing: this.editedUserData.marketing
          };
          console.log('Profile updated successfully');
          this.isEditingProfile = false;
        } else {
          console.error('Failed to update profile:', response.message);
          alert('Failed to update profile. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    });
  }

  // Cancel profile editing
  cancelEdit(): void {
    this.isEditingProfile = false;
  }

  // Toggle password editing
  togglePasswordEdit(): void {
    this.isEditingPassword = !this.isEditingPassword;
    if (!this.isEditingPassword) {
      // Clear passwords when canceling edit
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  // Save new password
  savePassword(): void {
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      // You would implement a password update endpoint on your server
      this.userApiService.updatePassword(this.userData.userId, this.newPassword).subscribe({
        next: (response) => {
          console.log('Password updated successfully');
          this.isEditingPassword = false;
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (error) => {
          console.error('Error updating password:', error);
          alert('Failed to update password. Please try again.');
        }
      });
    } else {
      alert('Password does not match or is invalid!');
    }
  }

  // Cancel password editing
  cancelPasswordEdit(): void {
    this.isEditingPassword = false;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Toggle SMS editing
  toggleSMSEdit(): void {
    this.isEditingSMS = !this.isEditingSMS;
  }

  // Toggle language editing
  toggleLanguageEdit(): void {
    this.isEditingLanguage = !this.isEditingLanguage;
  }

  // Toggle currency editing
  toggleCurrencyEdit(): void {
    this.isEditingCurrency = !this.isEditingCurrency;
  }
}