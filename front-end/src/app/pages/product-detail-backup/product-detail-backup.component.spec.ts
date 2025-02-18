import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailBackupComponent } from './product-detail-backup.component';

describe('ProductDetailBackupComponent', () => {
  let component: ProductDetailBackupComponent;
  let fixture: ComponentFixture<ProductDetailBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailBackupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
