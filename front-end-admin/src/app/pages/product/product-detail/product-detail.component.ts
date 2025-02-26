import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: []
})
export class ProductDetailComponent {
  // Thông tin sản phẩm
  product = {
    id: 'BTT01',
    name: 'Bánh tráng trộn chà bông',
    reviewsCount: 599,
    rating: 4.5,
  };

  // Danh sách đánh giá
  reviews = [
    { id: 1, customer: 'Thành Tỷ', date: '26/02/24', content: 'Bánh tráng WinSnack đúng là "Ăn là ghiền"!', rating: 4 },
    { id: 2, customer: 'Linh Mèo', date: '25/02/24', content: 'Mình thích bánh tráng muối tắc nhất!', rating: 5 },
    { id: 3, customer: 'Duy Bé', date: '24/02/24', content: 'Giao hàng nhanh, bánh tráng giòn ngon.', rating: 4 },
    { id: 4, customer: 'Mai Hương', date: '23/02/24', content: 'Bánh tráng hơi mặn so với khẩu vị của mình.', rating: 3 },
    { id: 5, customer: 'Trung Cận', date: '22/02/24', content: 'Bánh tráng ngon nhưng gói hơi nhỏ.', rating: 4 },
    { id: 6, customer: 'Lan Ngọc', date: '21/02/24', content: 'Giao hàng nhanh, đóng gói đẹp.', rating: 5 }
  ];

  // Phân trang
  currentPage = 1;
  reviewsPerPage = 3;

  // Phản hồi từ admin
  replyContent = '';

  /** Lấy danh sách đánh giá theo trang */
  get paginatedReviews() {
    const start = (this.currentPage - 1) * this.reviewsPerPage;
    return this.reviews.slice(start, start + this.reviewsPerPage);
  }

  /** Chuyển đến trang tiếp theo */
  nextPage() {
    if (this.currentPage < Math.ceil(this.reviews.length / this.reviewsPerPage)) {
      this.currentPage++;
    }
  }

  /** Quay về trang trước */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /** Xử lý phản hồi đánh giá */
  addReply() {
    if (!this.replyContent.trim()) {
      alert('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    console.log(`Admin phản hồi: ${this.replyContent}`);
    this.replyContent = ''; // Xóa nội dung sau khi gửi
  }

  /** Hiển thị đánh giá sao */
  getStars(rating: number) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
