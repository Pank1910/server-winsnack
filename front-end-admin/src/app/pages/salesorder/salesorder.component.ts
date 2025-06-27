import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderApiService, OrderApi } from './../../order-api.service';

@Component({
  selector: 'app-salesorder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {
  orders: OrderApi[] = [];
  displayOrders: OrderApi[] = [];
  filteredOrders: OrderApi[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  searchText: string = '';
  selectedFilter: string = 'all';
  filterOptions: string[] = ['all', 'id', 'customer', 'date', 'status', 'payment'];
  filterLabels: { [key: string]: string } = {
    'all': 'All',
    'id': 'Order code',
    'customer': 'Customer',
    'date': 'Time',
    'status': 'Status',
    'payment': 'Payment'
  };
  isLoading: boolean = false;

  // Các trạng thái hợp lệ từ backend
  statusOptions: { value: string; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Canceled' }
  ];

  constructor(private orderApiService: OrderApiService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderApiService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...this.orders];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading order list:', error);
        this.isLoading = false;
      }
    });
  }

  reloadOrders(): void {
    this.searchText = '';
    this.selectedFilter = 'all';
    this.currentPage = 1;
    this.loadOrders();
  }

  searchOrders(): void {
    if (!this.searchText.trim()) {
      this.filteredOrders = [...this.orders];
    } else {
      const searchTerm = this.searchText.toLowerCase().trim();
      this.filteredOrders = this.orders.filter(order => {
        if (this.selectedFilter === 'all') {
          return (
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.toLowerCase().includes(searchTerm) ||
            `${order.date} ${order.time}`.toLowerCase().includes(searchTerm) ||
            this.getStatusDisplay(order.status).toLowerCase().includes(searchTerm) ||
            order.payment.toLowerCase().includes(searchTerm)
          );
        } else if (this.selectedFilter === 'status') {
          return this.getStatusDisplay(order.status).toLowerCase().includes(searchTerm);
        } else if (this.selectedFilter === 'date') {
          return `${order.date} ${order.time}`.toLowerCase().includes(searchTerm);
        } else {
          return order[this.selectedFilter as keyof OrderApi].toString().toLowerCase().includes(searchTerm);
        }
      });
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredOrders.length);
    this.displayOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Canceled';
      default: return 'Unknown';
    }
  }

  getStatusSelectClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-orange-100 border-orange-500 text-orange-500';
      case 'completed': return 'bg-green-100 border-green-500 text-green-500';
      case 'cancelled': return 'bg-red-100 border-red-500 text-red-500';
      default: return 'bg-gray-100 border-gray-500 text-gray-500';
    }
  }

  changeFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedFilter = select.value;
    this.searchOrders();
  }

  updateOrderStatus(order: OrderApi): void {
    this.isLoading = true;
    this.orderApiService.updateOrderStatus(order.id, order.status).subscribe({
      next: (response) => {
        console.log('Status update successful:', response);
        this.isLoading = false;
        // Cập nhật danh sách orders để đảm bảo đồng bộ
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index].status = order.status;
          this.filteredOrders = [...this.orders];
          this.updatePagination();
        }
      },
      error: (error) => {
        console.error('Error while updating status:', error);
        this.loadOrders(); // Tải lại nếu lỗi để đồng bộ
        this.isLoading = false;
      }
    });
  }
}