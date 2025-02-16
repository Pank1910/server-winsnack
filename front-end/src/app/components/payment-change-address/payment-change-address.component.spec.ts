import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChangeAddressComponent } from './payment-change-address.component';

describe('PaymentChangeAddressComponent', () => {
  let component: PaymentChangeAddressComponent;
  let fixture: ComponentFixture<PaymentChangeAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentChangeAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChangeAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
