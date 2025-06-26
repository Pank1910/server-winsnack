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

  // 🛒 Product data
  product = {
    _id: '', // ✅ Add ID field
    product_name: '',
    product_dept: '',
    stocked_quantity: 0,
    unit_price: 0,
    discount: 0,
    product_detail: '',
    rating: 4,
    isNew: false,
    isDiscounted: false, // ✅ Is discounted
    image_1: '',
    image_2: '',
    image_3: '',
    image_4: '',
    image_5: ''
  };

  // Product categories
  categories = ['Ready-made rice paper mix', 'Grilled rice paper', 'Sweet rice paper', 'Rice paper combo mixed flavors', 'Retail materials'];

  // 🖼 Array to store images before sending to API
  previewImages: string[] = [];
  selectedImages: File[] = [];
  fileNames: string = ''; // Property to store concatenated file names

  ngOnInit(): void {
    // ✅ Get the latest ID from API when initializing component
    this.getLastProductId();
  }

  /** ✅ Get the latest product ID to create the next ID */
  getLastProductId() {
    this.http.get('http://localhost:5000/products/lastId').subscribe({
      next: (response: any) => {
        // If an ID is returned from the server, increment by 1
        if (response && response.lastId) {
          this.product._id = (parseInt(response.lastId) + 1).toString();
        } else {
          // If no products exist, start from 31
          this.product._id = '31';
        }
        console.log('✅ New ID for product:', this.product._id);
      },
      error: (error) => {
        console.error('❌ Error getting product ID:', error);
        // Default to starting from 31 if an error occurs
        this.product._id = '31';
      }
    });
  }

  /** 🧮 Allow entering discount only if "Discounted product" is selected */
  checkDiscount() {
    if (!this.product.isDiscounted) {
      this.product.discount = 0;
    }
  }

  /** 🧮 Calculate price after discount */
  calculateFinalPrice() {
    if (this.product.isDiscounted && this.product.discount > 0) {
      return this.product.unit_price * (1 - this.product.discount / 100);
    }
    return this.product.unit_price;
  }

  /** 🖼 Handle image upload */
  handleImageUpload(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: File, index) => {
        if (index < 5) { // Limit to 5 images
          this.selectedImages.push(file);
          const key = `image_${index + 1}` as keyof typeof this.product;
          (this.product as any)[key] = URL.createObjectURL(file);

          // Read file to display preview before sending to API
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewImages.push(e.target.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
      this.updateFileNames(); // Update file names after upload
    }
  }

  /** 🗑 Remove selected image */
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.previewImages.splice(index, 1);

    // Remove image from product.image_1, image_2, ...
    const key = `image_${index + 1}`;
    (this.product as any)[key] = ''; // ✅ Typecast to any to avoid TypeScript error
    this.updateFileNames(); // Update file names after removal
  }

  /** 🖼 Update displayed file names based on selected images */
  updateFileNames() {
    if (this.selectedImages.length === 0) {
      this.fileNames = 'No files selected';
    } else {
      this.fileNames = this.selectedImages.map(file => file.name).join(', ');
    }
  }

  /** 🖼 Get tooltip text based on selected images */
  getTooltipText(): string {
    return this.selectedImages.length === 0 ? 'No Files Selected' : this.fileNames;
  }

  /** 🚀 Send data to API */
  submitForm() {
    console.log('📌 Product data sent to API:', this.product);

    // Check for errors
    if (!this.product.product_name || !this.product.product_dept) {
      alert('❌ Please enter complete product information!');
      return;
    }

    if (this.product.isDiscounted && this.product.discount <= 0) {
      alert('⚠️ Please enter a valid discount if the product is on sale!');
      return;
    }

    if (this.selectedImages.length === 0) {
      alert('❌ Please select at least one image!');
      return;
    }

    // 📝 FormData to send product data & images
    const formData = new FormData();
    formData.append('_id', this.product._id); // ✅ Add ID to form data
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
      formData.append(`images`, file); // ✅ Correct key for `multer`
    });
    console.log('🚀 FormData sent to API:', formData);

    // 🛠 Send data to API
    this.http.post('http://localhost:5000/products', formData).subscribe({
      next: (response) => {
        console.log('✅ API Response:', response);
        alert('🎉 Product added successfully!');
        this.router.navigate(['/product-list']); // ✅ Navigate back to product page
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        alert('⚠️ Unable to add product, please try again!');
      }
    });
  }

  /** 🔙 Cancel and return to list */
  cancel() {
    this.router.navigate(['/product-list']); // ✅ Navigate back to product page
  }
}
