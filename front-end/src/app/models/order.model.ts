export interface ProductOrder {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

export interface Contact {
  name: string;
  phone: string;
  additionalNotes: string;
}

export interface Order {
  _id: string;
  userId: string;
  userName: string;
  items: ProductOrder[];
  totalPrice: number;
  address: string;
  contact: Contact;
  paymentMethod: string;
  createdAt: string;
  status: string;
}
