import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  errors: { [key: string]: string } = {};

  passwordVisible = false;
  confirmPasswordVisible = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      profileName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      newsletter: [false],
      terms: [false, Validators.requiredTrue],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator for password matching
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  };

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  toggleNewsletter() {
    const current = this.registerForm.get('newsletter')?.value;
    this.registerForm.get('newsletter')?.setValue(!current);
  }
  
  toggleTerms() {
    const current = this.registerForm.get('terms')?.value;
    this.registerForm.get('terms')?.setValue(!current);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      this.errors = { general: 'Please fill in all information.' };
      return;
    }

    const { profileName, password } = this.registerForm.value;
    
    this.isSubmitting = true;
    this.errors = {}; // Clear previous errors
    
    this.authService.register({ profileName, password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errors = { general: err.error?.message || 'Registration failed' };
        this.isSubmitting = false;
      },
    });
  }
}