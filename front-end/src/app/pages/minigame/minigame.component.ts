import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minigame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minigame.component.html',
  styleUrls: ['./minigame.component.css']
})
export class MinigameComponent {
  showBanner2: boolean = false
  showBanner: boolean = false; // Trạng thái ẩn/hiện banner
  showImage: boolean = false;  // Trạng thái ẩn/hiện hình ảnh
  showBanner5: boolean = false;  // Trạng thái ẩn/hiện banner 5
  showBanner6: boolean = false;

  toggleBanner2(): void {
    this.showBanner2 = !this.showBanner2; // Đảo trạng thái Banner 2
    console.log('Banner 2 trạng thái:', this.showBanner2);
  }

  toggleBanner(): void {
    this.showBanner = !this.showBanner; // Đảo trạng thái banner
    console.log('Banner trạng thái:', this.showBanner);
  }

  toggleImage(): void {
    this.showImage = !this.showImage; // Đảo trạng thái hình ảnh
  }

  toggleBanner5(): void {
    this.showBanner5 = !this.showBanner5; // Đảo trạng thái khi bấm nút
    console.log('Banner 5 trạng thái:', this.showBanner5);
  }

  toggleBanner6(): void {
    this.showBanner6 = true; // Hiển thị Banner6 khi bấm "Xem thêm"
    console.log('Banner 6 hiển thị:', this.showBanner6);
  }
  banners = [
    { id: 'specialOffer', src: 'assets/images/minigame/Banner1.png', title: 'Ưu đãi đặc biệt cho phái đẹp' },
    { id: 'productLaunch', src: 'assets/images/minigame/Banner2.png', title: 'Ra mắt sản phẩm mới' }
  ];

  currentBannerIndex = 0;

  constructor() {
    this.autoSlide();
  }

  autoSlide(): void {
    setInterval(() => {
      this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
    }, 3000); // Banner tự động thay đổi sau 3 giây
  }

  scrollToSection(sectionId: string): void {
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 200); // Cuộn xuống phần tương ứng khi bấm vào banner
  }
  
}
