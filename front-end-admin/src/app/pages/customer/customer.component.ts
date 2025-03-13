import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerApiService, CustomerApiUser } from './../../customer-api.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // Khách hàng từ API
  allCustomers: CustomerApiUser[] = [];
  
  // Khách hàng đang hiển thị sau khi lọc
  filteredCustomers: CustomerApiUser[] = [];
  
  // Khách hàng hiển thị trên trang hiện tại
  displayCustomers: CustomerApiUser[] = [];
  
  // Tham số tìm kiếm
  searchTerm: string = '';
  searchType: string = 'all';
  
  // Tham số phân trang
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  
  // Trạng thái loading
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private customerApiService: CustomerApiService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Tải dữ liệu khách hàng từ API
  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.customerApiService.getCustomers().subscribe({
      next: (customers) => {
        this.allCustomers = customers;
        this.filteredCustomers = [...this.allCustomers];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải dữ liệu khách hàng:', error);
        this.errorMessage = 'Không thể tải dữ liệu khách hàng. Vui lòng thử lại sau.';
        this.isLoading = false;
      }
    });
  }

  // Tìm kiếm khách hàng
  search(): void {
    if (!this.searchTerm.trim()) {
      // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
      this.filteredCustomers = [...this.allCustomers];
      this.updatePagination();
      return;
    }
    
    // Có 2 cách tiếp cận:
    // 1. Tìm kiếm trên server (hiệu quả hơn với dữ liệu lớn)
    // 2. Tìm kiếm trên client (hiệu quả với dữ liệu nhỏ, đã được tải về)
    
    // Cách 1: Tìm kiếm trên server
    this.isLoading = true;
    this.customerApiService.searchCustomers(this.searchTerm, this.searchType).subscribe({
      next: (customers) => {
        this.filteredCustomers = customers;
        this.currentPage = 1;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tìm kiếm khách hàng:', error);
        // Fallback to client-side filtering
        this.performClientSideSearch();
        this.isLoading = false;
      }
    });
    
    // Cách 2: Tìm kiếm trên client (làm fallback)
    // this.performClientSideSearch();
  }
  
  // Tìm kiếm trên client (dùng khi API search không hoạt động)
  performClientSideSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    this.filteredCustomers = this.allCustomers.filter(customer => {
      // Nếu searchType là 'all', tìm kiếm trong tất cả các trường
      if (this.searchType === 'all') {
        return customer.name.toLowerCase().includes(term) ||
               customer.email.toLowerCase().includes(term) ||
               (customer.phone && customer.phone.includes(term)) ||
               (customer.address && customer.address.toLowerCase().includes(term)) ||
               customer.orderCount.toString().includes(term);
      }
      
      // Nếu không, tìm kiếm theo trường cụ thể
      switch (this.searchType) {
        case 'name':
          return customer.name.toLowerCase().includes(term);
        case 'email':
          return customer.email.toLowerCase().includes(term);
        case 'phone':
          return customer.phone && customer.phone.includes(term);
        case 'address':
          return customer.address && customer.address.toLowerCase().includes(term);
        case 'orderCount':
          return customer.orderCount.toString().includes(term);
        default:
          return false;
      }
    });
    
    // Reset về trang đầu tiên sau khi tìm kiếm
    this.currentPage = 1;
    this.updatePagination();
  }

  // Cập nhật dữ liệu phân trang
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    
    // Tính toán số khách hàng hiển thị trên trang hiện tại
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredCustomers.length);
    
    this.displayCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  // Chuyển đến trang được chỉ định
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Lấy danh sách số trang để hiển thị
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  // Làm mới dữ liệu
  refreshData(): void {
    this.loadCustomers();
  }
}