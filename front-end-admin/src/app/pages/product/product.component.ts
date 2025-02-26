import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true, // Nếu bạn dùng standalone component, cần bật dòng này
  imports: [CommonModule,FormsModule,RouterModule], // Import CommonModule để dùng ngFor, ngClass, currency pipe
  templateUrl: './product.component.html',
  styleUrls: []
})
export class ProductComponent {
  products = [
    { id: 'BTT01', category: 'Bánh tráng trộn sẵn', image: 'assets/images/product/Chabong.png', name: 'Bánh tráng trộn chà bông', price: 25000, visible: true },
    { id: 'BTT01', category: 'Bánh tráng trộn sẵn', image: 'assets/images/product/Chabong.png', name: 'Bánh tráng trộn chà bông', price: 25000, visible: true },
    { id: 'BTT01', category: 'Bánh tráng trộn sẵn', image: 'assets/images/product/Chabong.png', name: 'Bánh tráng trộn chà bông', price: 25000, visible: true },
    { id: 'BTT01', category: 'Bánh tráng trộn sẵn', image: 'assets/images/product/Chabong.png', name: 'Bánh tráng trộn chà bông', price: 25000, visible: true },
    { id: 'BTT01', category: 'Bánh tráng trộn sẵn', image: 'assets/images/product/Chabong.png', name: 'Bánh tráng trộn chà bông', price: 25000, visible: true },
    { id: 'BTT01', category: 'Bánh tráng trộn sẵn', image: 'assets/images/product/Chabong.png', name: 'Bánh tráng trộn chà bông', price: 25000, visible: true },
  ];

  filteredProducts = [...this.products];

  addProduct() {
    console.log('Thêm sản phẩm mới');
  }

  editProduct(id: string) {
    console.log(`Chỉnh sửa sản phẩm: ${id}`);
  }

  deleteProduct(id: string) {
    this.products = this.products.filter(product => product.id !== id);
    this.filteredProducts = [...this.products];
    console.log(`Xóa sản phẩm: ${id}`);
  }

  viewProduct(id: string) {
    console.log(`Xem chi tiết sản phẩm: ${id}`);
  }

  searchProduct(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue)
    );
  }
}
