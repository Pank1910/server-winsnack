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
  product: Partial<Product> = {}; // ✅ Use Partial to avoid TypeScript errors
  imageFields: (keyof Product)[] = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'];
  selectedImages: File[] = []; // Array to store selected files
  fileNames: string = ''; // String to display file names

  loading = false;
  error = '';
  categories = ['Pre-mixed rice paper', 'Grilled rice paper', 'Sweet rice paper', 'Mixed flavor rice paper combo', 'Loose ingredients']; // If categories are fetched from API, update later

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
        console.log('API data received:', response);
        this.product = response.data;
        this.initializeExistingImages(); // Initialize existing images on load
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Unable to load product data';
        this.loading = false;
      }
    });
  }

  initializeExistingImages(): void {
    const existingImages = this.imageFields.filter(field => this.getImage(field));
    this.fileNames = existingImages.length > 0 ? existingImages.map(field => `Existing ${field}`).join(', ') : '';
  }

  calculateFinalPrice(): number {
    const price = this.product?.unit_price ?? 0; // ✅ Ensure no undefined
    const discount = this.product?.discount ?? 0; // ✅ Ensure no undefined
    return price * (1 - discount / 100);
  }

  getImage(field: keyof Product): string {
    return (this.product as any)[field] ?? '';
  }

  hasExistingImages(): boolean {
    return this.imageFields.some(field => this.getImage(field));
  }

  getDisplayedImages(): string {
    if (this.fileNames) {
      return this.fileNames;
    } else if (this.hasExistingImages()) {
      return this.imageFields.map(field => this.getImage(field)).filter(img => img).join(', ');
    }
    return 'No file selected';
  }

  handleImageUpload(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedImages = Array.from(files); // Store selected files
      this.updateFileNames(); // Update file names display
      const reader = new FileReader();
      for (let i = 0; i < files.length && i < this.imageFields.length; i++) {
        const file = files[i];
        reader.onload = (e: any) => {
          if (this.product) {
            (this.product as any)[this.imageFields[i]] = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      this.initializeExistingImages(); // Revert to existing images if no new files
    }
  }

  updateFileNames(): void {
    this.fileNames = this.selectedImages.map(file => file.name).join(', ');
  }

  getTooltipText(): string {
    return 'Click to select image files';
  }

  cancelUpdate(): void {
    this.router.navigate(['/product-list']);
  }

  updateProduct(): void {
    if (!this.product._id) {
        console.error("❌ Error: Product ID not found!");
        alert("Error: Product ID not found!");
        return;
    }

    // 🛑 If ID is a number, convert to string
    const productId = this.product._id.toString();

    console.log("📌 Product ID sent:", productId);
    console.log("📌 Data sent to API:", JSON.stringify(this.product, null, 2));

    this.productService.updateProduct(productId, this.product as Product).subscribe({
        next: (res) => {
            console.log("✅ API update successful:", res);
            alert('Product updated successfully!');
            this.router.navigate(['/product-list']);
        },
        error: (err) => {
            console.error("❌ API error during product update:", err);
            console.error("📌 Error details:", err.message);
            console.error("📌 API response:", err.error);
            alert("Unable to update product. Please check again!");
            this.loading = false;
        }
    });
  }
}
