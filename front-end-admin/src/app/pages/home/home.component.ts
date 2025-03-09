import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('revenueChart') revenueChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userActivityChart') userActivityChartCanvas!: ElementRef<HTMLCanvasElement>;

  orderCount: number = 576;
  customerCount: number = 1294;
  productCount: number = 1303;
  revenue: number = 10004755;

  private revenueChart: Chart | undefined;
  private userActivityChart: Chart | undefined;

  ngOnInit(): void {
    this.updateStats();
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  ngOnDestroy(): void {
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.userActivityChart) this.userActivityChart.destroy();
  }

  private initializeCharts(): void {
    const revenueCtx = this.revenueChartCanvas.nativeElement.getContext('2d');
    if (revenueCtx && !this.revenueChart) {
      this.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Doanh thu',
            data: [50, 60, 70, 60, 80, 90, 85, 75, 90, 95, 100, 85],
            borderColor: 'rgba(255, 126, 95, 1)',
            backgroundColor: 'rgba(255, 126, 95, 0.2)',
            fill: true,
            tension: 0.4 // Thêm đường cong mượt mà
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    const userActivityCtx = this.userActivityChartCanvas.nativeElement.getContext('2d');
    if (userActivityCtx && !this.userActivityChart) {
      this.userActivityChart = new Chart(userActivityCtx, {
        type: 'bar',
        data: {
          labels: ['Aug', 'Jul'],
          datasets: [
            {
              label: 'Người dùng tự do',
              data: [80, 50],
              backgroundColor: 'rgba(255, 97, 74, 0.8)',
              borderColor: 'rgba(255, 97, 74, 1)',
              borderWidth: 1
            },
            {
              label: 'Hội viên',
              data: [30, 10],
              backgroundColor: 'rgba(240, 179, 112, 0.8)',
              borderColor: 'rgba(240, 179, 112, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  }

  updateStats(month: string = 'thang-nay'): void {
    switch (month) {
      case 'thang-nay':
        this.orderCount = 576;
        this.customerCount = 1294;
        this.productCount = 1303;
        this.revenue = 10004755;
        break;
      case 'thang-truoc':
        this.orderCount = 500;
        this.customerCount = 1100;
        this.productCount = 1200;
        this.revenue = 9000000;
        break;
      case 'quy-1':
        this.orderCount = 1500;
        this.customerCount = 3500;
        this.productCount = 5000;
        this.revenue = 30000000;
        break;
      case 'quy-2':
        this.orderCount = 1200;
        this.customerCount = 3000;
        this.productCount = 4500;
        this.revenue = 25000000;
        break;
    }
  }

  onMonthChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.updateStats(selectElement.value);
  }
}