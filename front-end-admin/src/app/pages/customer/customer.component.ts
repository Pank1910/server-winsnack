import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  orderCount: number;
}

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // Dữ liệu khách hàng mẫu
  allCustomers: Customer[] = [
    {
      name: 'Trần Vũ Duyên An',
      email: 'duyenan@gmail.com',
      phone: '0977888999',
      address: '789 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh',
      orderCount: 5
    },
    {
      name: 'Linh Linh',
      email: 'khanhlinh@gmail.com',
      phone: '0123456789',
      address: 'KTX Khu B, Mạc Đĩnh Chi, Phường Linh Xuân, TP. Thủ Đức, TP. Hồ Chí Minh',
      orderCount: 2
    },
    {
      name: 'Võ Nguyên Bảo Trân',
      email: 'vngbaotranc@gmail.com',
      phone: '0949656822',
      address: '235, Trần Hưng Đạo, Châu Đốc, An Giang',
      orderCount: 18
    },
    {
      name: 'Tỷ Lê',
      email: 'tylentt22@gmail.com',
      phone: '0122268686',
      address: '22 phường Hiệp Bình Chánh, Quận 9, TP. Hồ Chí Minh',
      orderCount: 1
    },
    {
      name: 'Phương Anh',
      email: 'ahnnlp@gmail.com',
      phone: '0123456789',
      address: 'KTX Khu B, Mạc Đĩnh Chi, Phường Linh Xuân, TP. Thủ Đức, TP. Hồ Chí Minh',
      orderCount: 6
    },
    {
      name: 'Thảo Nguyên',
      email: 'nguyent@gmail.com',
      phone: '0987654321',
      address: '123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh',
      orderCount: 8
    },
    {
      name: 'Minh Tuấn',
      email: 'tuanminh@gmail.com',
      phone: '0909123456',
      address: '456 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      orderCount: 12
    },
    {
      name: 'Hoàng Yến',
      email: 'yenhoang@gmail.com',
      phone: '0977888999',
      address: '789 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh',
      orderCount: 4
    }
  ];

  // Khách hàng đang hiển thị sau khi lọc
  filteredCustomers: Customer[] = [];
  
  // Khách hàng hiển thị trên trang hiện tại
  displayCustomers: Customer[] = [];
  
  // Tham số tìm kiếm
  searchTerm: string = '';
  searchType: string = 'all'; // Thay đổi giá trị mặc định thành 'all'
  
  // Tham số phân trang
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  constructor() { }

  ngOnInit(): void {
    // Khởi tạo danh sách khách hàng khi component được tạo
    this.filteredCustomers = [...this.allCustomers];
    this.updatePagination();
  }

  // Tìm kiếm khách hàng
  search(): void {
    if (!this.searchTerm.trim()) {
      // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
      this.filteredCustomers = [...this.allCustomers];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      
      this.filteredCustomers = this.allCustomers.filter(customer => {
        // Nếu searchType là 'all', tìm kiếm trong tất cả các trường
        if (this.searchType === 'all') {
          return customer.name.toLowerCase().includes(term) ||
                 customer.email.toLowerCase().includes(term) ||
                 customer.phone.includes(term) ||
                 customer.address.toLowerCase().includes(term) ||
                 customer.orderCount.toString().includes(term);
        }
        
        // Nếu không, tìm kiếm theo trường cụ thể
        switch (this.searchType) {
          case 'name':
            return customer.name.toLowerCase().includes(term);
          case 'email':
            return customer.email.toLowerCase().includes(term);
          case 'phone':
            return customer.phone.includes(term);
          case 'address':
            return customer.address.toLowerCase().includes(term);
          case 'orderCount':
            return customer.orderCount.toString().includes(term);
          default:
            return false;
        }
      });
    }
    
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
}