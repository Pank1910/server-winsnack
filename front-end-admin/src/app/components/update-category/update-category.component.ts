import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule],
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  
  // Giả sử đối tượng category được load từ database
  category: any = {
    name: 'Tên danh mục mẫu',
    quantity: 10,
    status: true,
    img: 'assets/sample-category.png'
  };

  // Danh sách sản phẩm thuộc danh mục
  products: any[] = [
    {
      id: 1,
      name: 'Sản phẩm 1',
      imageUrl: 'assets/product1.png',
      productCount: 5,
      price: '100,000 VND',
      isVisible: true
    },
    {
      id: 2,
      name: 'Sản phẩm 2',
      imageUrl: 'assets/product2.png',
      productCount: 3,
      price: '150,000 VND',
      isVisible: false
    }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // Khởi tạo form với các giá trị từ đối tượng category
    this.categoryForm = this.fb.group({
      name: [this.category.name, Validators.required],
      quantity: [this.category.quantity, Validators.required],
      status: [this.category.status]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      // Thực hiện cập nhật danh mục, ví dụ gọi API cập nhật
      console.log('Cập nhật danh mục:', this.categoryForm.value);
    } else {
      console.log('Form không hợp lệ');
    }
  }

  toggleStatus(event: any): void {
    const checked = event.target.checked;
    this.categoryForm.patchValue({ status: checked });
  }

  onFileSelected(event: any): void {
    // Xử lý file được chọn từ ngx-dropzone
    const file = event.addedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Cập nhật preview hình ảnh danh mục
        this.category.img = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct(): void {
    // Logic để thêm sản phẩm mới (có thể mở modal hoặc chuyển hướng sang trang thêm sản phẩm)
    this.router.navigate(['/new-product']);
  }

  toggleVisibility(productId: number): void {
    // Chuyển đổi trạng thái hiển thị của sản phẩm
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.isVisible = !product.isVisible;
    }
  }

  editProduct(product: any): void {
    // Logic chỉnh sửa sản phẩm, ví dụ mở modal chỉnh sửa
    this.router.navigate(['/edit-product', product]);
  }

  deleteProduct(productId: number): void {
    // Logic xóa sản phẩm
    console.log('Xóa sản phẩm với id:', productId);
    this.products = this.products.filter(p => p.id !== productId);
  }

  cancel(): void {
    // Xử lý khi bấm hủy (có thể điều hướng về trang danh mục hoặc reset form)
    console.log('Hủy cập nhật danh mục');
  }
}
