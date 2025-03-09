import { Component, OnInit } from '@angular/core';
import { ProductApiService } from '../../product-api.service';
import { Product } from '../../../../../my-server-mongodb/interface/Product';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-category',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
    products: Product[] = [];
    filteredProductsList: Product[] = [];
    minPrice = 0;
    maxPrice = 250000;
    selectedCategory = '';

    categories: string[] = [
        "Bánh tráng trộn sẵn",
        "Bánh tráng nướng",
        "Bánh tráng ngọt",
        "Combo bánh tráng mix vị",
        "Nguyên liệu lẻ"
    ];

    constructor(
        private productService: ProductApiService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.loadAllProducts();
        // Đón nhận category từ query params
        this.route.queryParams.subscribe(params => {
            const category = params['category'];
            if (category) {
            // Tìm category phù hợp trong danh sách
            const matchedCategory = this.categories.find(
                c => c === category
            );
            
            if (matchedCategory) {
                this.changeCategory(matchedCategory);
            }
            }
        });
        }

    loadAllProducts(): void {
        this.productService.getAllProducts().subscribe({
            next: (response) => {
                this.products = response.data;
                this.filteredProductsList = this.products; // Mặc định hiển thị tất cả
            },
            error: (err) => {
                console.error('Lỗi khi tải danh sách sản phẩm:', err);
            }
        });
    }

    changeCategory(category: string): void {
        this.selectedCategory = category;
        this.filteredProductsList = this.products.filter(p => p.product_dept === category);
        this.applyPriceFilter();
    }

    filterPromotion(): void {
        this.selectedCategory = 'Khuyến mãi';
        this.filteredProductsList = this.products.filter(p => p.discount > 0);
        this.applyPriceFilter();
    }

    filterNewArrival(): void {
        this.selectedCategory = 'Mới xuất hiện';
        this.filteredProductsList = this.products.filter(p => p.isNew);
        this.applyPriceFilter();
    }

    applyPriceFilter(): void {
        this.filteredProductsList = this.filteredProductsList.filter(p => {
            const price = p.unit_price * (1 - p.discount);
            return price >= this.minPrice && price <= this.maxPrice;
        });
    }

    resetFilter(): void {
        this.minPrice = 0;
        this.maxPrice = 250000;
        this.selectedCategory = '';
        this.filteredProductsList = this.products;
    }

    filteredProducts(): Product[] {
        return this.filteredProductsList;
    }

    formatPrice(price: number): string {
        return price.toLocaleString('vi-VN');
    }

    goToProductDetail(productId: string): void {
        this.router.navigate(['/product-detail', productId]);
    }
}
