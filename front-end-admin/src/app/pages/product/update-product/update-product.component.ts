import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-product',
  standalone: true, // Nếu dùng Standalone Component
  imports: [CommonModule, FormsModule], // Thêm FormsModule
  templateUrl: './update-product.component.html',
  styleUrls: []
})
export class UpdateProductComponent implements OnInit {
  product = {
    id: '',
    name: '',
    category: '',
    isVisible: false,
    isDiscounted: false,
    currentPrice: 0,
    discount: 0,
    finalPrice: 0,
    info: '',
    description: '',
    images: [] as File[], 
    previewImages: [] as string[]
  };

  categories = ['Bánh tráng', 'Snack'];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductData(productId);
    }
  }

  loadProductData(productId: string) {
    const mockProduct = {
      id: productId,
      name: 'Bánh tráng trộn chà bông',
      category: 'Bánh tráng',
      isVisible: true,
      isDiscounted: true,
      currentPrice: 50000,
      discount: 10,
      finalPrice: 45000,
      info: 'Bánh tráng ngon, giòn, đậm vị',
      description: 'Sản phẩm bán chạy nhất với công thức độc quyền',
      images: [],
      previewImages: ['assets/images/product/Chabong.png']
    };

    this.product = mockProduct;
  }

  calculateFinalPrice() {
    this.product.finalPrice = this.product.discount > 0
      ? this.product.currentPrice * (1 - this.product.discount / 100)
      : this.product.currentPrice;
  }

  handleImageUpload(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: File) => {
        this.product.images.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.product.previewImages.push(e.target.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.product.images.splice(index, 1);
    this.product.previewImages.splice(index, 1);
  }

  cancelUpdate() {
    this.router.navigate(['/products']);
  }

  updateProduct() {
    alert('Sản phẩm đã được cập nhật thành công!');
    this.router.navigate(['/products']);
  }
}
