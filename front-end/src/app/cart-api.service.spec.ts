import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartAPIService } from './cart-api.service';
import { CartItem } from '../../../my-server-mongodb/interface/Cart';

describe('CartAPIService', () => {
  let service: CartAPIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartAPIService]
    });
    service = TestBed.inject(CartAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cart items', () => {
    const userId = 'user123';
    const mockCartItems: CartItem[] = [
      { 
        isSelected: true,
        productId: 'product1',
        quantity: 2,
        unit_price: 100,
        product_name: 'Test Product',
        image_1: 'test.jpg',
        stocked_quantity: 10,
        userId: 'user123'
      }
    ];

    service.getCartItems(userId).subscribe(items => {
      expect(items).toEqual(mockCartItems);
    });

    const req = httpMock.expectOne(`http://localhost:5000/cart?userId=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCartItems);
  });

  it('should add item to cart', () => {
    const userId = 'user123';
    const productId = 'product1';
    const quantity = 2;
    const unit_price = 100;
    const mockResponse = { message: 'Item added to cart' };

    service.addToCart(userId, productId, quantity, unit_price).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/cart/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId, productId, quantity, unit_price });
    req.flush(mockResponse);
  });

  it('should remove item from cart', () => {
    const userId = 'user123';
    const productId = 'product1';
    const mockResponse = { message: 'Item removed from cart' };

    service.removeFromCart(userId, productId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/cart/remove/${productId}?userId=${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should update item quantity', () => {
    const userId = 'user123';
    const productId = 'product1';
    const quantity = 3;
    const mockResponse = { message: 'Quantity updated' };

    service.updateQuantity(userId, productId, quantity).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/cart/update/${productId}?userId=${userId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ quantity });
    req.flush(mockResponse);
  });

  it('should update all cart items', () => {
    const userId = 'user123';
    const items = [
      { productId: 'product1', quantity: 2, unit_price: 100 },
      { productId: 'product2', quantity: 1, unit_price: 200 }
    ];
    const mockResponse = { message: 'Cart updated successfully' };

    service.updateCartItems(userId, items).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/cart/update-all');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ userId, items });
    req.flush(mockResponse);
  });

  it('should save selected items', () => {
    const userId = 'user123';
    const selectedItems: CartItem[] = [
      { 
        isSelected: true,
        productId: 'product1',
        quantity: 2,
        unit_price: 100,
        product_name: 'Test Product',
        userId: 'user123'
      }
    ];
    const mockResponse = { message: 'Selected items saved' };

    service.saveSelectedItems(userId, selectedItems).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/cart/saveSelectedItems');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId, selectedItems });
    req.flush(mockResponse);
  });

  it('should clear cart', () => {
    const userId = 'user123';
    const mockResponse = { message: 'Cart cleared' };

    service.clearCart(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/cart/clear?userId=${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});