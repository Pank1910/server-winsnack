import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductApiService } from '../../../product-api.service';
import { Product } from '../../../../../../my-server-mongodb/interface/Product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: []
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews = [
    { id: 1, customer: 'Thành Tỷ', date: '26/02/24', content: 'Bánh tráng WinSnack đúng là "Ăn là ghiền"!', rating: 4 },
    { id: 2, customer: 'Linh Mèo', date: '25/02/24', content: 'Mình thích bánh tráng muối tắc nhất!', rating: 5 },
    { id: 3, customer: 'Duy Bé', date: '24/02/24', content: 'Giao hàng nhanh, bánh tráng giòn ngon.', rating: 4 },
    { id: 4, customer: 'Mai Hương', date: '23/02/24', content: 'Bánh tráng hơi mặn so với khẩu vị của mình.', rating: 3 },
    { id: 5, customer: 'Trung Cận', date: '22/02/24', content: 'Bánh tráng ngon nhưng gói hơi nhỏ.', rating: 4 },
    { id: 6, customer: 'Lan Ngọc', date: '21/02/24', content: 'Giao hàng nhanh, đóng gói đẹp.', rating: 5 }
  ];
  currentPage = 1;
  reviewsPerPage = 3;
  replyContent = '';
  showPopup = false;

  constructor(private route: ActivatedRoute, private productService: ProductApiService,    private router: Router // ✅ Inject Router vào constructor
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe(
      (response) => {
        if (response.success) {
          this.product = response.data;
        }
      },
      (error) => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      }
    );
  }

  get paginatedReviews() {
    const start = (this.currentPage - 1) * this.reviewsPerPage;
    return this.reviews.slice(start, start + this.reviewsPerPage);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.reviews.length / this.reviewsPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  addReply() {
    if (!this.replyContent.trim()) {
      alert('Vui lòng nhập nội dung phản hồi!');
      return;
    }
    console.log(`Admin phản hồi: ${this.replyContent}`);
    this.replyContent = '';

    this.showPopup = true; // ✅ Hiển thị popup
    setTimeout(() => {
      this.showPopup = false;
      this.router.navigate(['/product-list']); // ✅ Quay về danh sách sản phẩm
    }, 2000);
  }
  cancel() {
    this.router.navigate(['/product-list']); // ✅ Quay về danh sách sản phẩm
  }
  /** ✅ Đóng popup và navigate về product-list */
  closePopup() {
    this.showPopup = false;
    this.router.navigate(['/product-list']); // ✅ Quay về danh sách sản phẩm
  }
  getStars(rating: number): string {
    if (typeof rating !== 'number' || isNaN(rating)) {
      return '☆☆☆☆☆';
    }
    const fullStars = Math.max(0, Math.floor(rating));
    const emptyStars = Math.max(0, 5 - fullStars);
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }
}
