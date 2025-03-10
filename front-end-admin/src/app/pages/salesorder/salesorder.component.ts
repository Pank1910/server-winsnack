import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Order {
  id: string;
  customer: string;
  time: string;
  date: string;
  status: 'processing' | 'cancelled' | 'delivered';
  payment: string;
}

@Component({
  selector: 'app-salesorder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {
  
  // Dữ liệu đa dạng hơn
  orders: Order[] = [
    { id: 'DNXJFN123', customer: 'Nguyễn Linh', time: '08:49 am', date: '02/12/2024', status: 'processing', payment: 'Chuyển khoản' },
    { id: 'KDLS7849', customer: 'Trần Minh', time: '10:15 am', date: '03/12/2024', status: 'processing', payment: 'Tiền mặt' },
    { id: 'HSTF3452', customer: 'Lê Hương', time: '11:30 am', date: '04/12/2024', status: 'cancelled', payment: 'Ví điện tử' },
    { id: 'MKST9103', customer: 'Phạm Thảo', time: '02:45 pm', date: '05/12/2024', status: 'cancelled', payment: 'Chuyển khoản' },
    { id: 'PQRS5678', customer: 'Hoàng Nam', time: '09:20 am', date: '06/12/2024', status: 'delivered', payment: 'Tiền mặt' },
    { id: 'ABCD9012', customer: 'Đỗ Trang', time: '01:35 pm', date: '07/12/2024', status: 'delivered', payment: 'Ví điện tử' },
    { id: 'EFGH3456', customer: 'Võ Thành', time: '03:40 pm', date: '08/12/2024', status: 'processing', payment: 'Chuyển khoản' },
    { id: 'IJKL7890', customer: 'Ngô Lan', time: '05:10 pm', date: '09/12/2024', status: 'cancelled', payment: 'Tiền mặt' },
    { id: 'MNOP1234', customer: 'Bùi Hùng', time: '08:25 am', date: '10/12/2024', status: 'delivered', payment: 'Ví điện tử' },
    { id: 'QRST5678', customer: 'Dương Hoa', time: '11:55 am', date: '11/12/2024', status: 'processing', payment: 'Chuyển khoản' },
    { id: 'UVWX9012', customer: 'Lý Quân', time: '02:15 pm', date: '12/12/2024', status: 'delivered', payment: 'Tiền mặt' },
    { id: 'YZAB3456', customer: 'Mai Anh', time: '04:30 pm', date: '13/12/2024', status: 'cancelled', payment: 'Ví điện tử' },
    { id: 'CDEF7890', customer: 'Trịnh Tuấn', time: '09:45 am', date: '14/12/2024', status: 'processing', payment: 'Chuyển khoản' },
    { id: 'GHIJ1234', customer: 'Vũ Minh', time: '12:50 pm', date: '15/12/2024', status: 'delivered', payment: 'Tiền mặt' },
    { id: 'KLMN5678', customer: 'Tạ Hà', time: '03:05 pm', date: '16/12/2024', status: 'cancelled', payment: 'Ví điện tử' },
    { id: 'OPQR9012', customer: 'Đinh Long', time: '05:25 pm', date: '17/12/2024', status: 'processing', payment: 'Chuyển khoản' },
    { id: 'STUV3456', customer: 'Chu Yến', time: '10:40 am', date: '18/12/2024', status: 'delivered', payment: 'Tiền mặt' }
  ];

  // Dữ liệu hiển thị trên trang hiện tại
  displayOrders: Order[] = [];
  filteredOrders: Order[] = [];
  
  // Tham số phân trang
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // Tham số tìm kiếm
  searchText: string = '';
  selectedFilter: string = 'all';
  filterOptions: string[] = ['all', 'id', 'customer', 'date', 'status', 'payment'];
  filterLabels: { [key: string]: string } = {
    'all': 'Tất cả',
    'id': 'Mã đơn hàng',
    'customer': 'Khách hàng',
    'date': 'Thời gian',
    'status': 'Tình trạng',
    'payment': 'Thanh toán'
  };

  constructor() { }

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
    this.updatePagination();
  }

  // Tìm kiếm và lọc đơn hàng
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
          return order[this.selectedFilter as keyof Order].toString().toLowerCase().includes(searchTerm);
        }
      });
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }

  // Cập nhật dữ liệu phân trang
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    
    // Tính toán số đơn hàng hiển thị trên trang hiện tại
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredOrders.length);
    
    this.displayOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  // Chuyển đến trang được chỉ định
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Lấy trạng thái hiển thị
  getStatusDisplay(status: string): string {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Đã hủy';
      case 'delivered':
        return 'Đã giao hàng';
      default:
        return 'Không xác định';
    }
  }

  // Lấy class cho button tình trạng
  getStatusButtonClass(status: string): string {
    switch (status) {
      case 'processing':
        return 'bg-orange-100 border border-orange-500 text-orange-500';
      case 'cancelled':
        return 'bg-red-100 border border-red-500 text-red-500';
      case 'delivered':
        return 'bg-green-100 border border-green-500 text-green-500';
      default:
        return 'bg-gray-100 border border-gray-500 text-gray-500';
    }
  }

  // Thay đổi filter
  changeFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedFilter = select.value;
    this.searchOrders();
  }
}