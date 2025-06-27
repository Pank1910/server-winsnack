import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OrderApiService, OrderDetailApi } from './../../../order-api.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild('orderContent', { static: false }) orderContent!: ElementRef;

  order: OrderDetailApi = {
    id: '',
    orderDate: '',
    orderTime: '',
    status: '',
    recipientName: '',
    recipientAddress: '',
    recipientPhone: '',
    items: [],
    subtotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 0
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private orderApiService: OrderApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        this.fetchOrderDetails(orderId);
      }
    });
  }

  fetchOrderDetails(orderId: string): void {
    this.orderApiService.getOrderDetail(orderId).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
      }
    });
  }

  exportOrder(): void {
    const element = this.orderContent.nativeElement;
  
    // Tạo một bản sao ẩn của nội dung để xử lý PDF
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px'; // Đẩy ra ngoài màn hình để không hiển thị
  
    // Thêm lớp pdf-mode vào bản sao để tùy chỉnh giao diện cho PDF
    clonedElement.classList.add('pdf-mode');
  
    // Thêm bản sao vào DOM
    document.body.appendChild(clonedElement);
  
    // Đợi DOM cập nhật
    setTimeout(() => {
      html2canvas(clonedElement, { scale: 2 } as any).then((canvas: HTMLCanvasElement) => {
        // Tạo canvas tạm để xử lý trắng đen
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const ctx = tempCanvas.getContext('2d')!;
  
        ctx.drawImage(canvas, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        // Chuyển sang trắng đen
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
          data[i] = gray;     // Red
          data[i + 1] = gray; // Green
          data[i + 2] = gray; // Blue
        }
  
        ctx.putImageData(imageData, 0, 0);
  
        const imgData = tempCanvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
  
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
  
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;
  
        pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
        pdf.save(`Invoice_${this.order.id}.pdf`);
  
        // Xóa bản sao sau khi hoàn tất
        document.body.removeChild(clonedElement);
      }).catch((error: any) => {
        console.error('Error exporting PDF:', error);
        // Xóa bản sao nếu có lỗi
        document.body.removeChild(clonedElement);
      });
    }, 100);
  }

  goBack(): void {
    this.location.back();
  }
}