import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: []
})
export class AddProductComponent {
  constructor(private http: HttpClient, private router: Router) {}

  // 🛒 Dữ liệu sản phẩm
  product = {
    product_name: '',
    product_dept: '',
    stocked_quantity: 0,
    unit_price: 0,
    discount: 0,
    product_detail: '',
    rating: 4,
    isNew: false,
    isDiscounted: false, // ✅ Có giảm giá không
    image_1: '',
    image_2: '',
    image_3: '',
    image_4: '',
    image_5: ''
  };

  // Danh mục sản phẩm
  categories = ['Bánh tráng trộn sẵn', 'Bánh tráng nướng', 'Bánh tráng ngọt', 'Combo bánh tráng mix vị', 'Nguyên liệu lẻ'];

  // 🖼 Mảng lưu ảnh trước khi gửi API
  previewImages: string[] = [];
  selectedImages: File[] = [];

  /** 🧮 Chỉ cho nhập giảm giá nếu chọn "Sản phẩm khuyến mãi" */
  checkDiscount() {
    if (!this.product.isDiscounted) {
      this.product.discount = 0;
    }
  }

  /** 🧮 Tính giá sau khuyến mãi */
  calculateFinalPrice() {
    if (this.product.isDiscounted && this.product.discount > 0) {
      return this.product.unit_price * (1 - this.product.discount / 100);
    }
    return this.product.unit_price;
  }

  /** 🖼 Xử lý tải ảnh */
  handleImageUpload(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: File, index) => {
        if (index < 5) { // Giới hạn 5 ảnh
          this.selectedImages.push(file);
          const key = `image_${index + 1}` as keyof typeof this.product;
          (this.product as any)[key] = URL.createObjectURL(file);

          // Đọc file để hiển thị trước khi gửi API
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewImages.push(e.target.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  /** 🗑 Xóa ảnh đã chọn */
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.previewImages.splice(index, 1);

    // Xóa ảnh khỏi product.image_1, image_2, ...
    const key = `image_${index + 1}`;
    (this.product as any)[key] = ''; // ✅ Ép kiểu any để tránh lỗi TypeScript
  }

  /** 🚀 Gửi dữ liệu lên API */
  submitForm() {
    console.log('📌 Dữ liệu sản phẩm gửi lên API:', this.product);

    // Kiểm tra lỗi
    if (!this.product.product_name || !this.product.product_dept) {
      alert('❌ Vui lòng nhập đầy đủ thông tin sản phẩm!');
      return;
    }

    if (this.product.isDiscounted && this.product.discount <= 0) {
      alert('⚠️ Vui lòng nhập giảm giá hợp lệ nếu sản phẩm có khuyến mãi!');
      return;
    }

    if (this.selectedImages.length === 0) {
      alert('❌ Vui lòng chọn ít nhất một hình ảnh!');
      return;
    }

    // 📝 FormData gửi dữ liệu sản phẩm & ảnh
    const formData = new FormData();
    formData.append('product_name', this.product.product_name);
    formData.append('product_dept', this.product.product_dept);
    formData.append('stocked_quantity', String(this.product.stocked_quantity));
    formData.append('unit_price', String(this.product.unit_price));
    formData.append('discount', String(this.product.discount));
    formData.append('product_detail', this.product.product_detail);
    formData.append('rating', String(this.product.rating));
    formData.append('isNew', String(this.product.isNew));
    formData.append('isDiscounted', String(this.product.isDiscounted));

    this.selectedImages.forEach((file, index) => {
      formData.append(`images`, file); // ✅ Đúng key của `multer`
    });
    console.log('🚀 FormData gửi lên API:', formData);

    // 🛠 Gửi dữ liệu lên API
    this.http.post('http://localhost:5000/products', formData).subscribe({
      next: (response) => {
        console.log('✅ API Response:', response);
        alert('🎉 Sản phẩm đã được thêm thành công!');
        this.router.navigate(['/product-list']); // ✅ Quay lại trang product
      },
      error: (error) => {
        console.error('❌ Lỗi API:', error);
        alert('⚠️ Không thể thêm sản phẩm, vui lòng thử lại!');
      }
    });
  }

  /** 🔙 Hủy và quay lại danh sách */
  cancel() {
    this.router.navigate(['/product-list']); // ✅ Quay lại trang product
  }
}
