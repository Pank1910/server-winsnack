import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentNewAddressComponent } from './payment-new-address.component';

describe('PaymentNewAddressComponent', () => {
  let component: PaymentNewAddressComponent;
  let fixture: ComponentFixture<PaymentNewAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentNewAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentNewAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
