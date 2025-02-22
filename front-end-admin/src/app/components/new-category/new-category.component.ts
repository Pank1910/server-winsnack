import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface CategoryProduct {
  id: string;
  name: string;
  // Thêm các thuộc tính khác nếu cần
}

@Component({
  selector: 'app-new-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent implements OnInit {
  // Khai báo các biến
  categoryForm!: FormGroup;
  isActive: boolean = false;
  products: CategoryProduct[] = [];
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // Thêm các service cần thiết ở đây
  ) {
    // Khởi tạo form
    this.initForm();
  }

  ngOnInit(): void {
    // Có thể load dữ liệu ban đầu nếu cần
  }

  // Khởi tạo form với FormBuilder
  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Tên danh mục, bắt buộc và ít nhất 3 ký tự
      status: [false], // Trạng thái hiển thị, mặc định là false
      image: [null] // Trường lưu file hình ảnh
    });
  }

  // Xử lý khi toggle trạng thái
  toggleStatus(event: any): void {
    this.isActive = event.target.checked;
    this.categoryForm.patchValue({
      status: this.isActive
    });
  }

  // Xử lý khi chọn file
  onFileSelected(event: any): void {
    const files = event.addedFiles;
    if (files && files.length > 0) {
      // Kiểm tra kích thước file (50MB = 52428800 bytes)
      if (files[0].size > 52428800) {
        alert('File quá lớn. Vui lòng chọn file nhỏ hơn 50MB');
        return;
      }
      
      // Kiểm tra loại file
      if (!files[0].type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }

      this.selectedFiles = files;
      this.categoryForm.patchValue({
        image: files[0]
      });
    }
  }

  // Xử lý khi xóa file
  onRemove(event: any): void {
    this.selectedFiles = [];
    this.categoryForm.patchValue({
      image: null
    });
  }

  // Thêm sản phẩm mới vào danh mục
  addProduct(): void {
    // Chuyển hướng đến trang thêm sản phẩm
    // Hoặc mở modal thêm sản phẩm tùy theo thiết kế
    this.router.navigate(['/new-product']);
  }

  // Xử lý khi hủy
  cancel(): void {
    // Xác nhận trước khi hủy
    if (confirm('Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
      this.router.navigate(['/product-category']); // Điều hướng về trang danh sách danh mục
    }
  }

  // Xử lý khi submit form
  async onSubmit(): Promise<void> {
    if (this.categoryForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')?.value);
      formData.append('status', this.categoryForm.get('status')?.value);
      
      if (this.selectedFiles.length > 0) {
        formData.append('image', this.selectedFiles[0]);
      }

      // Gọi API để lưu danh mục
      // await this.categoryService.createCategory(formData);
      
      alert('Tạo danh mục thành công');
      this.router.navigate(['/categories']);
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
      alert('Có lỗi xảy ra khi tạo danh mục. Vui lòng thử lại.');
    }
  }

  // Kiểm tra xem form có đang valid không
  isFormValid(): boolean {
    return this.categoryForm.valid && this.selectedFiles.length > 0;
  }
}