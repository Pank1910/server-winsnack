// src/app/models/user.model.ts

export interface UserBirthDate {
    day: string;
    month: string;
    year: string;
  }
  
  export interface User {
    _id: string;
    profileName: string;
    email: string;
    password?: string; // Dùng dấu ? vì không nên lưu password ở client
    gender: 'male' | 'female' | 'other';
    birthDate: UserBirthDate;
    marketing: boolean;
    address: string;
    phone: string;
    role: 'admin' | 'user';
    action?: string;
  }