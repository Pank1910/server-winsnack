import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';

// Định nghĩa interfaces
export interface Category {
  id?: string;
  name: string;
  isVisible: boolean;
  products: Product[];
  imageUrl?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  isVisible: boolean;
}

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxDropzoneModule]
})
export class NewCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  products: Product[] = [];
  isSubmitting = false;
  
  selectedFile: string | null = null; // URL xem trước ảnh
  fileToUpload: File | null = null; // File thực tế
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      status: [true], // Mặc định là hiển thị
    });
  }

  toggleStatus(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.categoryForm.get('status')?.setValue(checked);
  }

  onFileSelected(event: any): void {
    const files = event.addedFiles || (event.target?.files || []);
    if (files.length === 0) return;
    
    const file: File = files[0];
    
    // Kiểm tra kích thước file (tối đa 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Tệp quá lớn, vui lòng chọn tệp dưới 50MB');
      return;
    }

    // Kiểm tra định dạng file (chỉ hỗ trợ PNG, JPG, JPEG)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Định dạng tệp không hợp lệ, chỉ hỗ trợ PNG, JPG, JPEG');
      return;
    }

    this.fileToUpload = file; // Lưu file để xử lý khi submit form

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedFile = e.target.result; // Lưu URL ảnh để hiển thị
    };

    reader.readAsDataURL(file);
  }

  // Sự kiện khi thả file vào dropzone
  onSelect(event: any): void {
    this.onFileSelected(event);
  }

  // Khi bấm nút "Đăng tải tệp"
  openFilePicker(fileInput: HTMLInputElement): void {
    fileInput.click(); // Kích hoạt input file ẩn để chọn ảnh
  }

  // Xóa ảnh đã chọn
  removeFile(): void {
    this.selectedFile = null;
    this.fileToUpload = null;
  }
  
  addProduct(): void {
    // Chuyển hướng đến trang thêm sản phẩm hoặc mở modal
    this.router.navigate(['/add-product', { categoryId: 'new' }]);
  }

  onSubmit(): void {
    console.log('Form status:', this.categoryForm.valid);
    console.log('Name value:', this.categoryForm.get('name')?.value);
    console.log('File selected:', this.selectedFile);
    
    // Kiểm tra form có hợp lệ không
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      alert('Vui lòng nhập đầy đủ thông tin danh mục.');
      return;
    }

    // Kiểm tra đã chọn ảnh chưa
    if (!this.selectedFile) {
      alert('Vui lòng chọn một hình ảnh cho danh mục.');
      return;
    }

    // Cảnh báo nếu không có sản phẩm nào
    if (this.products.length === 0) {
      const confirmNoProducts = confirm(
        'Danh mục chưa có sản phẩm. Bạn có muốn tiếp tục không?'
      );
      if (!confirmNoProducts) return;
      this.isSubmitting = true;
    }

    // Giả lập việc tải ảnh lên server
    setTimeout(() => {
      // Tạo đối tượng danh mục từ form
      const category: Category = {
        name: this.categoryForm.get('name')?.value,
        isVisible: this.categoryForm.get('status')?.value,
        products: this.products,
        imageUrl: this.selectedFile!, // Sử dụng URL hình ảnh đã chọn
        createdAt: new Date()
      };

      // Gửi dữ liệu đến API (giả lập)
      console.log('Đã gửi danh mục:', category);

      this.isSubmitting = false;
      alert('Danh mục đã được thêm thành công!');
      this.router.navigate(['/product-category']); // Chuyển hướng
    }, 1000);
  }

  cancel(): void {
    // Quay lại trang danh sách danh mục
    this.router.navigate(['/product-category']);
  }
}