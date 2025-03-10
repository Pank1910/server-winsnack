import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Promotion {
  id: number;
  category: string;
  code: string;
  description: string;
  status: 'On Sales' | 'Expired';
  used: number;
  total: number;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css'
})
export class PromotionComponent implements OnInit {
  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  
  searchText: string = '';
  filterColumn: string = 'Tất cả';
  
  showAddEditForm: boolean = false;
  isEditing: boolean = false;
  
  currentPromotion: Promotion = {
    id: 0,
    category: '',
    code: '',
    description: '',
    status: 'On Sales',
    used: 0,
    total: 0,
    startDate: '',
    endDate: ''
  };

  ngOnInit(): void {
    // Khởi tạo dữ liệu mẫu
    this.promotions = [
      {
        id: 1,
        category: 'Mã giảm giá',
        code: 'PNTHFG152368',
        description: 'Giảm giá 20%, tối đa 30.000 VNĐ',
        status: 'On Sales',
        used: 30,
        total: 50,
        startDate: '26/02/24',
        endDate: '26/03/24'
      },
      {
        id: 2,
        category: 'Ưu đãi phí vận chuyển',
        code: 'SHIPFREE123',
        description: 'Giảm giá 20%, tối đa 30.000 VNĐ',
        status: 'Expired',
        used: 30,
        total: 50,
        startDate: '26/02/24',
        endDate: '26/02/24'
      },
      {
        id: 3,
        category: 'Ưu đãi phí vận chuyển',
        code: 'SHIPFREE456',
        description: 'Giảm giá 20%, tối đa 30.000 VNĐ',
        status: 'Expired',
        used: 30,
        total: 50,
        startDate: '26/02/24',
        endDate: '26/02/24'
      },
      // Thêm nhiều mẫu dữ liệu hơn để kiểm tra phân trang
      {
        id: 4,
        category: 'Mã giảm giá',
        code: 'SUMMER2024',
        description: 'Giảm giá 15%, không giới hạn',
        status: 'On Sales',
        used: 45,
        total: 100,
        startDate: '01/03/24',
        endDate: '30/04/24'
      },
      {
        id: 5,
        category: 'Mã giảm giá',
        code: 'NEWYEAR2024',
        description: 'Giảm giá 25%, tối đa 50.000 VNĐ',
        status: 'Expired',
        used: 98,
        total: 100,
        startDate: '01/01/24',
        endDate: '15/01/24'
      },
      {
        id: 6,
        category: 'Ưu đãi phí vận chuyển',
        code: 'SHIP100K',
        description: 'Miễn phí vận chuyển cho đơn hàng từ 100.000 VNĐ',
        status: 'On Sales',
        used: 25,
        total: 100,
        startDate: '15/02/24',
        endDate: '15/04/24'
      },
      {
        id: 7,
        category: 'Mã giảm giá',
        code: 'WELCOME10',
        description: 'Giảm 10% cho khách hàng mới',
        status: 'On Sales',
        used: 120,
        total: 500,
        startDate: '01/01/24',
        endDate: '31/12/24'
      }
    ];
    
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchText) {
      this.filteredPromotions = [...this.promotions];
    } else {
      this.filteredPromotions = this.promotions.filter(promo => {
        const searchLower = this.searchText.toLowerCase();
        
        // Lọc theo cột được chọn
        switch (this.filterColumn) {
          case 'Danh mục':
            return promo.category.toLowerCase().includes(searchLower);
          case 'Mã':
            return promo.code.toLowerCase().includes(searchLower) || 
                   promo.description.toLowerCase().includes(searchLower);
          case 'Tình trạng':
            return promo.status.toLowerCase().includes(searchLower);
          case 'Số lượng':
            return `${promo.used}/${promo.total}`.includes(this.searchText);
          case 'Bắt đầu':
            return promo.startDate.includes(this.searchText);
          case 'Kết thúc':
            return promo.endDate.includes(this.searchText);
          default: // 'Tất cả'
            return (
              promo.category.toLowerCase().includes(searchLower) ||
              promo.code.toLowerCase().includes(searchLower) ||
              promo.description.toLowerCase().includes(searchLower) ||
              promo.status.toLowerCase().includes(searchLower) ||
              `${promo.used}/${promo.total}`.includes(this.searchText) ||
              promo.startDate.includes(this.searchText) ||
              promo.endDate.includes(this.searchText)
            );
        }
      });
    }
    
    this.calculateTotalPages();
    this.goToPage(1);
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredPromotions.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
  }

  getCurrentPageItems(): Promotion[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPromotions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  addPromotion(): void {
    this.isEditing = false;
    this.currentPromotion = {
      id: 0,
      category: '',
      code: '',
      description: '',
      status: 'On Sales',
      used: 0,
      total: 0,
      startDate: this.formatDate(new Date()),
      endDate: this.formatDate(new Date())
    };
    this.showAddEditForm = true;
  }

  editPromotion(promo: Promotion): void {
    this.isEditing = true;
    this.currentPromotion = { ...promo };
    this.showAddEditForm = true;
  }

  deletePromotion(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      this.promotions = this.promotions.filter(p => p.id !== id);
      this.applyFilter();
    }
  }

  savePromotion(): void {
    if (this.isEditing) {
      // Cập nhật khuyến mãi hiện có
      const index = this.promotions.findIndex(p => p.id === this.currentPromotion.id);
      if (index !== -1) {
        this.promotions[index] = { ...this.currentPromotion };
      }
    } else {
      // Thêm khuyến mãi mới
      const newId = Math.max(0, ...this.promotions.map(p => p.id)) + 1;
      this.promotions.push({
        ...this.currentPromotion,
        id: newId
      });
    }
    
    this.showAddEditForm = false;
    this.applyFilter();
  }

  cancelForm(): void {
    this.showAddEditForm = false;
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
}