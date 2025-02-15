import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinigameComponent } from './minigame.component';
import { By } from '@angular/platform-browser'; // Để truy cập phần tử trong template

describe('MinigameComponent', () => {
  let component: MinigameComponent;
  let fixture: ComponentFixture<MinigameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinigameComponent ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinigameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid program start and end date', () => {
    expect(component.programStartDate).toBe('01/02/2025');
    expect(component.programEndDate).toBe('28/02/2025');
  });

  it('should display program details correctly', () => {
    const programTitle = fixture.debugElement.query(By.css('.program-title')).nativeElement;
    const programSubtitle = fixture.debugElement.query(By.css('.program-subtitle')).nativeElement;

    expect(programTitle.textContent).toBe('CHƯƠNG TRÌNH ĐẶC BIỆT');
    expect(programSubtitle.textContent).toBe('TRI ÂN KHÁCH HÀNG');
  });

  it('should display product names correctly', () => {
    const productNameElements = fixture.debugElement.queryAll(By.css('.product-card h3'));
    const productNames = productNameElements.map(element => element.nativeElement.textContent.trim());

    expect(productNames).toEqual([
      'Bánh tráng chà bông',
      'Bánh tráng rong biển',
      'Trà xanh chanh dây',
      'Bánh tráng sốt bơ'
    ]);
  });

  it('should call viewDetails when "Xem Chi Tiết" button is clicked', () => {
    spyOn(component, 'viewDetails');  // Giả lập hàm viewDetails

    const detailsButton = fixture.debugElement.query(By.css('.details-button'));
    detailsButton.triggerEventHandler('click', null); // Kích hoạt sự kiện click

    expect(component.viewDetails).toHaveBeenCalled();
  });

  it('should call buyNow when "Mua Ngay" button is clicked', () => {
    spyOn(component, 'buyNow');  // Giả lập hàm buyNow

    const buyNowButton = fixture.debugElement.query(By.css('.details-button1'));
    buyNowButton.triggerEventHandler('click', null); // Kích hoạt sự kiện click

    expect(component.buyNow).toHaveBeenCalled();
  });

  it('should have correct product data', () => {
    const product = component.topSellingProducts[0];

    expect(product.name).toBe('Bánh tráng chà bông');
    expect(product.image).toBe('/front-end/src/assets/images/product-category/Chabong.png');
    expect(product.rating).toBe(5.0);
    expect(product.reviews).toBe(100);
    expect(product.originalPrice).toBe(30000);
    expect(product.discountedPrice).toBe(25000);
  });
});
