import { Product } from "./../models/product.model";

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface OrderContact {
  name: string;
  phone: string;
}

export class Order {
  constructor(
    public _id: string | null = null,
    public userId: string = "",
    public userName: string = "",
    public items: {
      product: Product;
      quantity: number;
    }[] = [],
    public totalPrice: number = 0,
    public address: string = "",  // Chỉ còn một chuỗi thay vì object
    public contact: {
      name: string;
      phone: string;
    } = { name: "", phone: "" }, // Chỉ giữ lại name và phone
    public additionalNotes: string = "",
    public paymentMethod: string = "",
    public createdAt: Date = new Date(),
    public status: string = ""
  ) { }
}