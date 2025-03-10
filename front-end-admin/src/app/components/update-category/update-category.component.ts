import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../../my-server-mongodb/interface/Product';

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

  category = {
    product_dept: '',
    stocked_quantity: 0,
    isNew: false,
    image_1: 'assets/icons/upload-icon.png' // Default image
  };

  products: Product[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      product_dept: ['', Validators.required],
      stocked_quantity: ['', Validators.required],
      isNew: [false]
    });
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    
    this.isAddMode = !this.categoryId;
    
    if (this.isAddMode) {
      this.pageTitle = 'THÊM DANH MỤC MỚI';
    } else if (this.categoryId) {
      this.loadCategoryData(this.categoryId);
    }
  }

  loadCategoryData(product_dept: string) {
    // Giả lập dữ liệu danh mục từ danh sách sản phẩm
    const foundCategory = this.products.find(p => p.product_dept === product_dept);
    
    if (foundCategory) {
      this.category = { ...foundCategory };
      
      // Cập nhật form với dữ liệu danh mục
      this.categoryForm.patchValue({
        product_dept: this.category.product_dept,
        stocked_quantity: this.category.stocked_quantity,
        isNew: this.category.isNew
      });
    } else {
      alert('Không tìm thấy danh mục!');
      this.router.navigate(['/product-category']);
    }
  }

  toggleStatus(event: any) {
    this.category.isNew = event.target.checked;
  }

  onFileSelected(event: any) {
    const files = event.addedFiles;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.category.image_1 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleVisibility(productId: string) {
    const product = this.products.find(p => p._id === productId);
    if (product) {
      product.isNew = !product.isNew;
    }
  }

  editProduct(product: Product) {
    this.router.navigate(['/product-list', product._id, 'edit']);
  }

  deleteProduct(productId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.products = this.products.filter(p => p._id !== productId);
    }
  }

  addProduct() {
    this.router.navigate(['add-product'], { 
      queryParams: { product_dept: this.categoryId } 
    });
  }

  cancel() {
    this.router.navigate(['/product-category']);
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = {
        product_dept: this.categoryForm.value.product_dept,
        stocked_quantity: this.categoryForm.value.stocked_quantity,
        isNew: this.categoryForm.value.isNew,
        image_1: this.category.image_1
      };
      
      console.log('Submitting category data:', formData);
      
      if (this.isAddMode) {
        alert('Danh mục mới đã được tạo thành công!');
      } else {
        alert('Danh mục đã được cập nhật thành công!');
      }
      
      this.router.navigate(['/product-category']);
    } else {
      this.categoryForm.markAllAsTouched();
      alert('Vui lòng kiểm tra lại thông tin đã nhập!');
    }
  }
}
