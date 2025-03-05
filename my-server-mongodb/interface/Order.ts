import { Product } from "../models/product.model";

export class Order {
  constructor(
    public _id: string | null = null,
    public userId: string = "",
    public userName: string = "Anonymous",
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
    public paymentMethod: string = "cash_on_delivery",
    public createdAt: Date = new Date(),
    public status: string = "pending"
  ) { }
}