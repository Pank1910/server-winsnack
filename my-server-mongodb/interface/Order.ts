import { Product } from "../../my-server-mongodb/interface/Product";

export class Order {
  constructor(
    public _id: string | null = null,
    public orderId: string= "",
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
    public paymentMethod: string = "",
    public createdAt: Date = new Date(),
    public status: string = ""
  ) { }
}
