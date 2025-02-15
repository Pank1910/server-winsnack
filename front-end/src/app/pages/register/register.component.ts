import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  newsletter: boolean = false;
  terms: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  errors: { [key: string]: string } = {};

  constructor() { }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Validate the form before submission
  validateForm(): boolean {
    this.errors = {};

    if (!this.username.trim()) {
      this.errors['username'] = 'Thông tin này không được để trống';
    }

    if (!this.password.trim()) {
      this.errors['password'] = 'Thông tin này không được để trống';
    }

    if (this.password !== this.confirmPassword) {
      this.errors['confirmPassword'] = 'Mật khẩu không khớp';
    }

    if (!this.confirmPassword.trim()) {
      this.errors['confirmPassword'] = 'Thông tin này không được để trống';
    }

    return Object.keys(this.errors).length === 0;
  }

  // Submit the form
  onSubmit() {
    if (this.validateForm()) {
      console.log('Form Submitted');
      // Proceed with form submission logic
    } else {
      console.log('Form contains errors');
    }
  }
}
