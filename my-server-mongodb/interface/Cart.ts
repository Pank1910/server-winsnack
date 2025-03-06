// export interface CartItem {
//     productId: string | null;
//     quantity: number;
//     unit_price: number;
//     product_name: string;
//     image_1: string;
//     stocked_quantity: number;
//     userId?: string;
//   }

export interface CartItem {
  isSelected: boolean;
  productId: string;
  quantity: number;
  unit_price: number;
  product_name?: string;
  image_1?: string;
  stocked_quantity?: number;
  userId?: string; // Note: Đổi thành optional để phù hợp với trường hợp guest
}