import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Nhập CommonModule cho ngFor

@Component({
  selector: 'app-terms-and-policies1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-and-policies.component1.html',
  styleUrls: ['./terms-and-policies.component1.css']
})
export class TermsAndPolicies1Component {
  // Dữ liệu chính sách
  policyData = {
    title: 'Chính sách bán hàng & Đổi trả',
    intro: 'Tại WinSnack, chúng tôi cam kết mang đến cho khách hàng trải nghiệm mua sắm trực tuyến tiện lợi...',
    returnPolicy: {
      title: 'Chính sách đổi trả',
      intro: 'Chúng tôi hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ ngày khách hàng nhận được hàng.',
      points: [
        'Sản phẩm không đúng mẫu mã, chủng loại.',
        'Sản phẩm bị hư hỏng trong quá trình vận chuyển.'
      ],
      process: {
        title: 'Quy trình đổi trả',
        steps: [
          'Bước 1: Liên hệ với bộ phận chăm sóc khách hàng.',
          'Bước 2: Gửi sản phẩm về kho hàng.'
        ]
      }
    },
    importantNotice: {
      title: 'Lưu ý quan trọng',
      content: 'Thời gian xử lý yêu cầu đổi trả: Trong vòng 5 ngày làm việc kể từ khi nhận được sản phẩm đối trả.'
    }
  };
}
