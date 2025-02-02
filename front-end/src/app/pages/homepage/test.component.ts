import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class HomepageComponent {
  // Danh mục nổi bật
  ricepaperItems = [
    { title: 'Bánh tráng trộn sẵn', price: '20.000', image: 'assets/images/homepage/banhtrangtronsan.png' },
    { title: 'Bánh tráng nướng', price: '20.000', image: 'assets/images/homepage/banhtrangnuong.png' },
    { title: 'Bánh tráng ngọt', price: '20.000', image: 'assets/images/homepage/banhtrangngot.png' },
    { title: 'Combo mix vị', price: '20.000', image: 'assets/images/homepage/combomixvi.png' },
    { title: 'Bánh tráng phơi sương', price: '20.000', image: 'assets/images/homepage/banhtrangphoisuong.png' }
  ];

  // Sản phẩm bán chạy
  bestSellers = [
    { name: 'Bánh tráng chà bông', description: 'Hương vị thơm ngon', price: '25.000', image: 'assets/images/homepage/chabong.png' },
    { name: 'Bánh tráng rong biển', description: 'Giòn rụm, hấp dẫn', price: '30.000', image: 'assets/images/homepage/rongbien.png' },
    { name: 'Bánh tráng me cay', description: 'Chua cay đậm đà', price: '22.000', image: 'assets/images/homepage/mecay.png' },
    { name: 'Bánh tráng phô mai', description: 'Béo ngậy, giòn tan', price: '28.000', image: 'assets/images/homepage/phomai.png' },
    { name: 'Bánh tráng sa tế', description: 'Cay nồng hấp dẫn', price: '26.000', image: 'assets/images/homepage/sate.png' }
  ];

  // Blog
  blogPosts = [
    { title: 'Cách làm bánh tráng ngon tại nhà', image: 'assets/images/homepage/blog1.png' },
    { title: 'Mẹo chọn bánh tráng giòn lâu', image: 'assets/images/homepage/blog2.png' },
    { title: 'Khám phá các loại bánh tráng trên thị trường', image: 'assets/images/homepage/blog3.png' },
    { title: 'Bánh tráng và những câu chuyện tuổi thơ', image: 'assets/images/homepage/blog4.png' },
    { title: 'Lợi ích sức khỏe của bánh tráng', image: 'assets/images/homepage/blog5.png' }
  ];
}
