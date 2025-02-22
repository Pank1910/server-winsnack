import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  passwordVisible: boolean = false;
  errors: { [key: string]: string } = {};

  // Fake user data for demo (replace with actual authentication logic)
  fakeUserData = {
    username: 'winsnack@gmail.com',
    password: '123456'
  };

  constructor() { }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Validate the form before submission
  validateForm(): boolean {
    this.errors = {};

    // Check if username and password fields are filled
    if (!this.username.trim()) {
      this.errors['username'] = 'Tên đăng nhập không được để trống';
    } else if (this.username !== this.fakeUserData.username) {
      this.errors['username'] = 'Tên đăng nhập không tồn tại';
    }

    if (!this.password.trim()) {
      this.errors['password'] = 'Mật khẩu không được để trống';
    } else if (this.password !== this.fakeUserData.password) {
      this.errors['password'] = 'Mật khẩu không chính xác';
    }

    return Object.keys(this.errors).length === 0;
  }

  // Handle form submission
  onSubmit() {
    if (this.validateForm()) {
      console.log('Login successful');
      // Proceed with actual login logic
    } else {
      console.log('Form contains errors');
    }
  }
}
