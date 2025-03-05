export interface Product {
    _id: string;
    name: string;
    price: number;
  }
  
  export interface OrderItem {
    product: Product;
    quantity: number;
  }
  
  export interface OrderContact {
    name: string;
    phone: string;
  }
  
  export interface Order {
    _id?: string;
    userId: string;
    userName: string;
    items: OrderItem[];
    totalPrice: number;
    address: string;
    contact: OrderContact;
    additionalNotes?: string;
    paymentMethod: string;
    createdAt: Date;
    status: 'pending' | 'completed' | 'cancelled';
  }