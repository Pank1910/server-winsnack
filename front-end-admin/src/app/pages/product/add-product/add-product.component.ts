import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: []
})
export class AddProductComponent {
  constructor(private http: HttpClient) {} // 🛠 Inject HttpClient để gọi API

  // 🛒 Dữ liệu sản phẩm khớp với `Product.ts`
  product = {
    product_name: '',
    product_dept: '',
    stocked_quantity: 0,
    unit_price: 0,
    discount: 0,
    createdAt: '',
    product_detail: '',
    image_1: '',
    image_2: '',
    image_3: '',
    image_4: '',
    image_5: '',
    rating: 4,
    isNew: false
  };

  // Danh mục sản phẩm
  categories = ['Bánh tráng trộn sẵn', 'Bánh tráng nướng','Bánh tráng ngọt','Combo bánh tráng mix vị','Nguyên liệu lẻ'];

  // 🖼 Mảng lưu ảnh trước khi gửi API
  previewImages: string[] = [];
  selectedImages: File[] = [];

  /** 🧮 Tính giá sau khuyến mãi */
  calculateFinalPrice() {
    this.product.unit_price = this.product.discount > 0
      ? this.product.unit_price * (1 - this.product.discount / 100)
      : this.product.unit_price;
  }

  /** 🖼 Xử lý tải ảnh */
  handleImageUpload(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: File, index) => {
        if (index < 5) { // Giới hạn 5 ảnh
          this.selectedImages.push(file);

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
  }

  /** 🚀 Gửi dữ liệu lên API */
  submitForm() {
    console.log('📌 Dữ liệu sản phẩm:', this.product);

    // Kiểm tra lỗi
    if (!this.product.product_name || !this.product.product_dept) {
      alert('❌ Vui lòng nhập đầy đủ thông tin sản phẩm!');
      return;
    }

    // 📝 Tạo FormData để gửi file ảnh & dữ liệu sản phẩm
    const formData = new FormData();
    formData.append('product_name', this.product.product_name);
    formData.append('product_dept', this.product.product_dept);
    formData.append('stocked_quantity', String(this.product.stocked_quantity));
    formData.append('unit_price', String(this.product.unit_price));
    formData.append('discount', String(this.product.discount));
    formData.append('createdAt', new Date().toISOString());
    formData.append('product_detail', this.product.product_detail);
    formData.append('rating', String(this.product.rating));
    formData.append('isNew', String(this.product.isNew));

    // 🖼 Gửi tối đa 5 ảnh, map vào image_1 -> image_5
    this.selectedImages.forEach((file, index) => {
      formData.append(`image_${index + 1}`, file);
    });

    // 🛠 Gửi dữ liệu lên API
    this.http.post('http://localhost:5001/products', formData).subscribe({
      next: (response) => {
        console.log('✅ API Response:', response);
        alert('🎉 Sản phẩm đã được thêm thành công!');
      },
      error: (error) => {
        console.error('❌ Lỗi API:', error);
        alert('⚠️ Không thể thêm sản phẩm, vui lòng thử lại!');
      }
    });
  }
}
