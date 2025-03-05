import { Product } from "../../../../my-server-mongodb/models/product.model";

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
    public userName: string = "Anonymous",
    public items: OrderItem[] = [],
    public totalPrice: number = 0,
    public address: string = "",
    public contact: OrderContact = { name: "", phone: "" }, 
    public additionalNotes: string = "",
    public paymentMethod: string = "cash_on_delivery",
    public createdAt: Date = new Date(),
    public status: 'pending' | 'completed' | 'cancelled' = "pending"
  ) { }
}