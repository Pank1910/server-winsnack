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
  filterColumn: string = 'All';
  
  showAddEditForm: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = false; // Thêm biến để điều khiển spinner
  
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
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.isLoading = true; // Bật spinner
    const savedPromotions = localStorage.getItem('promotions');
    if (savedPromotions) {
      this.promotions = JSON.parse(savedPromotions);
    } else {
      this.promotions = [
        {
          id: 1,
          category: 'Discount Code',
          code: 'PNTHFG152368',
          description: '20% discount, up to 30,000 VND',
          status: 'On Sales',
          used: 30,
          total: 50,
          startDate: '26/02/24',
          endDate: '26/03/24'
        },
        {
          id: 2,
          category: 'Shipping Offer',
          code: 'SHIPFREE123',
          description: '20% discount, up to 30,000 VND',
          status: 'Expired',
          used: 30,
          total: 50,
          startDate: '26/02/24',
          endDate: '26/02/24'
        },
        {
          id: 3,
          category: 'Shipping Offer',
          code: 'SHIPFREE456',
          description: '20% discount, up to 30,000 VND',
          status: 'Expired',
          used: 30,
          total: 50,
          startDate: '26/02/24',
          endDate: '26/02/24'
        },
        {
          id: 4,
          category: 'Discount Code',
          code: 'SUMMER2024',
          description: '15% off, unlimited',
          status: 'On Sales',
          used: 45,
          total: 100,
          startDate: '01/03/24',
          endDate: '30/04/24'
        },
        {
          id: 5,
          category: 'Discount Code',
          code: 'NEWYEAR2024',
          description: '25% discount, up to 50,000 VND',
          status: 'Expired',
          used: 98,
          total: 100,
          startDate: '01/01/24',
          endDate: '15/01/24'
        },
        {
          id: 6,
          category: 'Shipping Offer',
          code: 'SHIP100K',
          description: 'Free shipping for orders over 100,000 VND',
          status: 'On Sales',
          used: 25,
          total: 100,
          startDate: '15/02/24',
          endDate: '15/04/24'
        },
        {
          id: 7,
          category: 'Discount Code',
          code: 'WELCOME10',
          description: '10% off for new customers',
          status: 'On Sales',
          used: 120,
          total: 500,
          startDate: '01/01/24',
          endDate: '31/12/24'
        }
      ];
      localStorage.setItem('promotions', JSON.stringify(this.promotions));
    }
    this.applyFilter();
    setTimeout(() => this.isLoading = false, 500); // Giả lập thời gian tải
  }

  saveToLocalStorage(): void {
    localStorage.setItem('promotions', JSON.stringify(this.promotions));
  }

  reloadPromotions(): void {
    this.searchText = '';
    this.filterColumn = 'All';
    this.currentPage = 1;
    this.loadPromotions(); // Tải lại dữ liệu với spinner
  }

  applyFilter(): void {
    if (!this.searchText) {
      this.filteredPromotions = [...this.promotions];
    } else {
      this.filteredPromotions = this.promotions.filter(promo => {
        const searchLower = this.searchText.toLowerCase();
        switch (this.filterColumn) {
          case 'Category':
            return promo.category.toLowerCase().includes(searchLower);
          case 'Code':
            return promo.code.toLowerCase().includes(searchLower) || 
                   promo.description.toLowerCase().includes(searchLower);
          case 'Status':
            return promo.status.toLowerCase().includes(searchLower);
          case 'Quantity':
            return `${promo.used}/${promo.total}`.includes(this.searchText);
          case 'Start':
            return promo.startDate.includes(this.searchText);
          case 'End':
            return promo.endDate.includes(this.searchText);
          default: // 'All'
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
    if (confirm('Are you sure you want to delete this promotion?')) {
      this.promotions = this.promotions.filter(p => p.id !== id);
      this.saveToLocalStorage();
      this.applyFilter();
    }
  }

  savePromotion(): void {
    if (this.isEditing) {
      const index = this.promotions.findIndex(p => p.id === this.currentPromotion.id);
      if (index !== -1) {
        this.promotions[index] = { ...this.currentPromotion };
      }
    } else {
      const newId = Math.max(0, ...this.promotions.map(p => p.id)) + 1;
      this.promotions.push({
        ...this.currentPromotion,
        id: newId
      });
    }
    this.showAddEditForm = false;
    this.saveToLocalStorage();
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