import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../../../my-server-mongodb/interface/Product';
import { ProductApiService } from '../../../product-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.component.html',
  styleUrls: []
})
export class UpdateProductComponent implements OnInit {
  product: Partial<Product> = {}; // ✅ Sử dụng Partial để tránh lỗi TypeScript
  imageFields: (keyof Product)[] = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'];

  loading = false;
  error = '';
  categories = ['Bánh tráng trộn sẵn', 'Bánh tráng nướng','Bánh tráng ngọt','Combo bánh tráng mix vị','Nguyên liệu lẻ']; // Nếu danh mục lấy từ API, cập nhật sau

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductApiService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductData(productId);
    }
  }

  loadProductData(productId: string): void {
    this.loading = true;
    this.error = '';

    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        console.log('Dữ liệu API trả về:', response);
        this.product = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải sản phẩm:', err);
        this.error = 'Không thể tải dữ liệu sản phẩm';
        this.loading = false;
      }
    });
  }

  calculateFinalPrice(): number {
    const price = this.product?.unit_price ?? 0; // ✅ Đảm bảo không bị undefined
    const discount = this.product?.discount ?? 0; // ✅ Đảm bảo không bị undefined
    return price * (1 - discount / 100);
  }

  getImage(field: string): string {
    return (this.product as any)?.[field] ?? '';
  }

  handleImageUpload(event: any, imageField: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.product) {
          (this.product as any)[imageField] = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  cancelUpdate(): void {
    this.router.navigate(['/products']);
  }

  updateProduct(): void {
    if (!this.product._id) {
        console.error("Lỗi: Không có ID sản phẩm!");
        alert("Lỗi: Không tìm thấy ID sản phẩm!");
        return;
    }

    this.loading = true;
    
    console.log("📌 Dữ liệu gửi lên API:", this.product);

    this.productService.updateProduct(this.product._id, this.product as Product).subscribe({
        next: () => {
            alert('Sản phẩm đã được cập nhật thành công!');
            this.router.navigate(['/products']);
        },
        error: (err) => {
            console.error("❌ Lỗi API khi cập nhật sản phẩm:", err);
            console.error("📌 Chi tiết lỗi:", err.message);
            alert("Không thể cập nhật sản phẩm. Vui lòng kiểm tra lại!");
            this.loading = false;
        }
    });
}

}
