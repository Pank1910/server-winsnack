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
    { id: 1, customer: 'Thanh Ty', date: '26/02/24', content: 'WinSnack rice paper is truly "Addictive"!', rating: 4 },
    { id: 2, customer: 'Linh Meo', date: '25/02/24', content: 'I like salted kumquat rice paper the most!', rating: 5 },
    { id: 3, customer: 'Duy Be', date: '24/02/24', content: 'Fast delivery, delicious crispy rice paper.', rating: 4 },
    { id: 4, customer: 'Mai Huong', date: '23/02/24', content: 'The rice paper is a bit salty for my taste.', rating: 3 },
    { id: 5, customer: 'Trung Can', date: '22/02/24', content: 'The rice paper is delicious but the package is a bit small.', rating: 4 },
    { id: 6, customer: 'Lan Ngoc', date: '21/02/24', content: 'Fast delivery, nice packaging.', rating: 5 }
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
        console.error('Error getting product details:', error);
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
      alert('Please enter feedback!');
      return;
    }
    console.log(`Admin response: ${this.replyContent}`);
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
