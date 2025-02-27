import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: []
})
export class AddProductComponent {
  // Dữ liệu sản phẩm
  product = {
    name: '',
    category: '',
    isVisible: false,
    isDiscounted: false,
    currentPrice: 0,
    discount: 0,
    finalPrice: 0,
    info: '',
    description: '',
    images: [] as File[], // Định nghĩa images là mảng File
    previewImages: [] as string[] // Định nghĩa previewImages là mảng string để lưu URL xem trước
  };

  // Danh mục sản phẩm
  categories = ['Bánh tráng', 'Snack'];

  /** Tính giá sau khuyến mãi */
  calculateFinalPrice() {
    this.product.finalPrice = this.product.discount > 0
      ? this.product.currentPrice * (1 - this.product.discount / 100)
      : this.product.currentPrice;
  }

  /** Xử lý tải ảnh */
  handleImageUpload(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: File) => {
        this.product.images.push(file); // Lưu file vào mảng images

        // Tạo FileReader để hiển thị ảnh trước khi upload
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.product.previewImages.push(e.target.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  /** Xóa ảnh đã chọn */
  removeImage(index: number) {
    this.product.images.splice(index, 1);
    this.product.previewImages.splice(index, 1);
  }

  /** Xử lý gửi form */
  submitForm() {
    console.log('Dữ liệu sản phẩm:', this.product);

    // Kiểm tra lỗi
    if (!this.product.name || !this.product.category) {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
      return;
    }

    // Gửi dữ liệu (có thể thay thế bằng API call)
    alert('Sản phẩm đã được thêm thành công!');
  }
}
