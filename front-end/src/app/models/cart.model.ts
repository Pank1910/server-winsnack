export interface Product {
  productID: string;       // ID sản phẩm
  name: string;            // Tên sản phẩm
  price: number;           // Giá sản phẩm
  quantity: number;        // Số lượng sản phẩm
  imageUrl: string;        // Đường dẫn ảnh sản phẩm
}

export interface Cart {
  cartID?: string;         // ID giỏ hàng (không bắt buộc)
  products: Product[];     // Danh sách sản phẩm trong giỏ hàng
}
