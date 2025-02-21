import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent {
  categories= [
    {
      id: "BTT",
      name: "Bánh tráng trộn sẵn",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/896fdd482ab781db036f93a8a777623d6dc08803d881b2bcb3b276f5b6f0a1a1?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 9,
      isVisible: true,
    },
    {
      id: "BTN",
      name: "Bánh tráng nướng",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/54593322546bbc60c0b1fe55175615cc5f687822b3161abbcf00451e0a034180?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 3,
      isVisible: true,
    },
    {
      id: "BTNG",
      name: "Bánh tráng ngọt",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/abe7d59de9f49fe6bc26ce4fe8f9e966c7b81ca5f820e4a4744cdcbf8a76ddb4?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 5,
      isVisible: true,
    },
    {
      id: "CB",
      name: "Combo bánh tráng mix gia vị",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/8284b2fb4a471ae49cc4d5b86a6a16697048cb09a24e568e42ae9f8eded2b0f8?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 10,
      isVisible: true,
    },
    {
      id: "NL",
      name: "Nguyên liệu lẻ",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/5e3bf7e5618c886f2e4aee4b0701b40d5d2f7c14243ef7c7eea329adbcc30856?placeholderIfAbsent=true&apiKey=083ffd2b40e84598849f8100adb3e8d1",
      productCount: 10,
      isVisible: true,
    },
  ];
  toggleVisibility(categoryId: string) {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.isVisible = !category.isVisible;
      console.log(`Trạng thái hiển thị của ${category.name}:`, category.isVisible);
    }
  }
}
