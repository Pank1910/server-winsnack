import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RouterModule } from '@angular/router';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
  price: string;
  isVisible: boolean;
}

interface Category {
  id: string;
  name: string;
  productCount: number;
  status: boolean;
  img: string;
}

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule, RouterModule],
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categoryId: string | null = null;
  isAddMode: boolean = false;
  pageTitle: string = 'CẬP NHẬT DANH MỤC';
  
  category: Category = {
    id: '',
    name: '',
    productCount: 0,
    status: false,
    img: 'assets/icons/upload-icon.png' // Default image
  };

  products: Product[] = [];

  // Mock database of categories
  categoriesData: Category[] = [
    {
      id: "BTT",
      name: "Bánh tráng trộn sẵn",
      productCount: 9,
      status: true,
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/abe7d59de9f49fe6bc26ce4fe8f9e966c7b81ca5f820e4a4744cdcbf8a76ddb4?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1"
    },
    {
      id: "BTNG",
      name: "Bánh tráng ngọt",
      productCount: 12,
      status: true,
      img: "assets/images/categories/banhtrangcuon.png"
    },
    {
      id: "BTN",
      name: "Bánh tráng nướng",
      productCount: 8,
      status: false,
      img: "assets/images/categories/banhtrangphoisuong.png"
    },
    {
      id: "CB",
      name: "Combo mix vị",
      productCount: 8,
      status: false,
      img: "assets/images/categories/banhtrangphoisuong.png"
    },
    {
      id: "NL",
      name: "Nguyên liệu lẻ",
      productCount: 8,
      status: false,
      img: "assets/images/categories/banhtrangphoisuong.png"
    }
  ];

  // Mock products data
  productsData: Record<string, Product[]> = {
    "BTT": [
      {
        id: '001',
        name: 'Bánh Tráng Trộn Sẵn Bơ Tỏi',
        imageUrl: 'assets/images/products/banhtrangtronbotoi.png',
        productCount: 50,
        price: '25.000 VND',
        isVisible: true
      },
      {
        id: '002',
        name: 'Bánh Tráng Trộn Sẵn Muối Tôm',
        imageUrl: 'assets/images/products/banhtrangtronsmuoitom.png',
        productCount: 60,
        price: '25.000 VND',
        isVisible: true
      }
    ],
    "BTN": [
      {
        id: '003',
        name: 'Bánh Tráng Cuộn Bơ',
        imageUrl: 'assets/images/products/banhtrangcuonbo.png',
        productCount: 35,
        price: '20.000 VND',
        isVisible: true
      }
    ],
    "BTNG": [
      {
        id: '004',
        name: 'Bánh Tráng Phơi Sương Truyền Thống',
        imageUrl: 'assets/images/products/banhtrangphoisuong.png',
        productCount: 40,
        price: '30.000 VND',
        isVisible: false
      }
    ],
    "CB": [
      {
        id: '004',
        name: 'Bánh Tráng Phơi Sương Truyền Thống',
        imageUrl: 'assets/images/products/banhtrangphoisuong.png',
        productCount: 40,
        price: '30.000 VND',
        isVisible: false
      }
    ],
    "NL": [
      {
        id: '004',
        name: 'Bánh Tráng Phơi Sương Truyền Thống',
        imageUrl: 'assets/images/products/banhtrangphoisuong.png',
        productCount: 40,
        price: '30.000 VND',
        isVisible: false
      }
    ]
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      status: [false]
    });
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    
    this.isAddMode = !this.categoryId;
    
    if (this.isAddMode) {
      this.pageTitle = 'THÊM DANH MỤC MỚI';
    } else if (this.categoryId) {
      this.loadCategoryData(this.categoryId);
      this.loadProductsData(this.categoryId);
    }
  }

  loadCategoryData(categoryId: string) {
    // Find the category in our mock database
    const foundCategory = this.categoriesData.find(c => c.id === categoryId);
    
    if (foundCategory) {
      this.category = { ...foundCategory };
      
      // Update form with category data
      this.categoryForm.patchValue({
        name: this.category.name,
        quantity: this.category.productCount,
        status: this.category.status
      });
    } else {
      alert('Không tìm thấy danh mục!');
      this.router.navigate(['/product-category']);
    }
  }

  loadProductsData(categoryId: string) {
    // Load products associated with this category
    this.products = this.productsData[categoryId] || [];
  }

  toggleStatus(event: any) {
    this.category.status = event.target.checked;
  }

  onFileSelected(event: any) {
    const files = event.addedFiles;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.category.img = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleVisibility(productId: string) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.isVisible = !product.isVisible;
    }
  }

  editProduct(product: Product) {
    this.router.navigate(['/product-list', product.id, 'edit']);
  }

  deleteProduct(productId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.products = this.products.filter(p => p.id !== productId);
    }
  }

  addProduct() {
    this.router.navigate(['add-product'], { 
      queryParams: { categoryId: this.categoryId } 
    });
  }

  cancel() {
    this.router.navigate(['/product-category']);
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = {
        id: this.isAddMode ? 'NEW-' + Date.now().toString().slice(-4) : this.category.id,
        name: this.categoryForm.value.name,
        productCount: this.categoryForm.value.quantity,
        status: this.categoryForm.value.status,
        img: this.category.img
      };
      
      console.log('Submitting category data:', formData);
      
      // In a real app, you would call a service to update the category
      if (this.isAddMode) {
        alert('Danh mục mới đã được tạo thành công!');
      } else {
        alert('Danh mục đã được cập nhật thành công!');
      }
      
      this.router.navigate(['/product-category']);
    } else {
      // Mark all fields as touched to trigger validation errors
      this.categoryForm.markAllAsTouched();
      alert('Vui lòng kiểm tra lại thông tin đã nhập!');
    }
  }
}