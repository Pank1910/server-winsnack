import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CheckoutPageComponent {
    promoCode: string = '';
    products: Product[] = [
      {
        id: 1,
        name: 'Bánh tráng sốt bơ',
        price: 25000,
        quantity: 3,
        image: ''
      },
      {
        id: 2,
        name: 'Bánh tráng rong biển',
        price: 25000,
        quantity: 2,
        image: ''
      },
      {
        id: 3,
        name: 'Bánh tráng chà bông',
        price: 25000,
        quantity: 5,
        image: ''
      }
    ];
  
    onSubmitPromoCode(): void {
      if (this.promoCode) {
        console.log('Promo code submitted:', this.promoCode);
      }
    }
  
    onPlaceOrder(): void {
      console.log('Order placed');
    }
  }
  