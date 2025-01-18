import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      imports: [RouterTestingModule],
      providers: [CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total price correctly', () => {
    component.cart = {
      items: [
        {
          name: 'Item 1', price: 100, quantity: 2, image: '',
          sku: '',
          product: ''
        },
        {
          name: 'Item 2', price: 200, quantity: 1, image: '',
          sku: '',
          product: ''
        }
      ]
    };
    expect(component.getTotal()).toEqual(400);
  });
});
