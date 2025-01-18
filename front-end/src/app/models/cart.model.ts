export interface Cart {
    items: Array<CartItem>;
  }
  
  export interface CartItem {
    sku: string;       // Mã sản phẩm duy nhất (bắt buộc)
    product: string;   // Tên sản phẩm (bắt buộc)
    name: string;      // Tên hiển thị (bắt buộc)
    price: number;     // Giá của sản phẩm (bắt buộc)
    quantity: number;  // Số lượng trong giỏ hàng (bắt buộc)
    image: string;     // URL hình ảnh sản phẩm (bắt buộc)
  }
  