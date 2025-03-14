export class Order {
  constructor(
    public _id: string | null = null,
    public orderId: string= "",
    public userId: string = "",
    public userName: string = "",
    public items: {
      product: {
        productId: string;
        product_name: string;
        quantity: number;
        unit_price: number;
        discount: number;
        total_price: number;
      };
      quantity: number;
    }[] = [],
    public shippingMethod: {
      estimated_delivery: string;
      cost: number;
    }[] = [],
    public totalPrice: number = 0,
    public contact: {
      address: string;
      phone: string;
    } = { address: "", phone: "" },
    public additionalNotes: string = "",
    public paymentMethod: string = "",
    public createdAt: Date = new Date(),
    public status: string = ""
  ) { }
}