import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderAPIService } from './order-api.service';
import { CartItem } from '../../../my-server-mongodb/interface/Cart';
import { Order } from '../../../my-server-mongodb/interface/Order';

interface PromoCodeValidationResult {
  isValid: boolean;
  discountAmount: number;
}

describe('OrderAPIService', () => {
  let service: OrderAPIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderAPIService]
    });
    service = TestBed.inject(OrderAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user cart items', () => {
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

    service.getUserCart(userId).subscribe(items => {
      expect(items).toEqual(mockCartItems);
    });

    const req = httpMock.expectOne(`http://localhost:5000/cart/items?userId=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCartItems);
  });

  it('should create a new order', () => {
    const orderData = {
      userId: 'user123',
      userName: 'Test User',
      items: [
        {
          product: {
            productId: 'product1',
            product_name: 'Test Product',
            quantity: 2,
            unit_price: 100,
            discount: 0,
            total_price: 200
          },
          quantity: 2
        }
      ],
      shippingMethod: [
        {
          estimated_delivery: '3-5 days',
          cost: 10
        }
      ],
      totalPrice: 210,
      contact: {
        address: '123 Test St',
        phone: '1234567890'
      },
      paymentMethod: 'credit card'
    };
    
    // Create mock response of the correct CartItem type
    const mockCartItemResponse: CartItem = {
      isSelected: true,
      productId: 'product1',
      quantity: 2,
      unit_price: 100,
      product_name: 'Test Product',
      userId: 'user123'
    };

    service.createOrder(orderData).subscribe(response => {
      expect(response).toEqual(mockCartItemResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/orders/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(orderData);
    req.flush(mockCartItemResponse);
  });

  it('should validate promo code', () => {
    const promoCode = 'DISCOUNT20';
    const mockValidationResult: PromoCodeValidationResult = {
      isValid: true,
      discountAmount: 20
    };

    service.validatePromoCode(promoCode).subscribe(result => {
      expect(result).toEqual(mockValidationResult);
    });

    const req = httpMock.expectOne('http://localhost:5000/orders/validate-promo');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ promoCode });
    req.flush(mockValidationResult);
  });

  it('should get order details', () => {
    const orderId = 'order123';
    const mockOrderDetails = new Order(
      'order123_id',
      orderId,
      'user123',
      'Test User',
      [
        {
          product: {
            productId: 'product1',
            product_name: 'Test Product',
            quantity: 2,
            unit_price: 100,
            discount: 0,
            total_price: 200
          },
          quantity: 2
        }
      ],
      [
        {
          estimated_delivery: '3-5 days',
          cost: 10
        }
      ],
      210,
      {
        address: '123 Test St',
        phone: '1234567890'
      },
      'Please deliver to front door',
      'credit card',
      new Date('2023-01-01'),
      'processing'
    );

    service.getOrderDetails(orderId).subscribe(details => {
      expect(details).toEqual(mockOrderDetails);
    });

    const req = httpMock.expectOne(`http://localhost:5000/orders/details/${orderId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrderDetails);
  });

  it('should get order history', () => {
    // Mock localStorage or sessionStorage
    spyOn(localStorage, 'getItem').and.returnValue('user123');
    
    const mockOrderHistory: Order[] = [
      new Order(
        'order123_id',
        'order123',
        'user123',
        'Test User',
        [
          {
            product: {
              productId: 'product1',
              product_name: 'Test Product',
              quantity: 2,
              unit_price: 100,
              discount: 0,
              total_price: 200
            },
            quantity: 2
          }
        ],
        [
          {
            estimated_delivery: '3-5 days',
            cost: 10
          }
        ],
        210,
        {
          address: '123 Test St',
          phone: '1234567890'
        },
        '',
        'credit card',
        new Date('2023-01-01'),
        'completed'
      ),
      new Order(
        'order456_id',
        'order456',
        'user123',
        'Test User',
        [
          {
            product: {
              productId: 'product2',
              product_name: 'Another Product',
              quantity: 1,
              unit_price: 150,
              discount: 0,
              total_price: 150
            },
            quantity: 1
          }
        ],
        [
          {
            estimated_delivery: '3-5 days',
            cost: 10
          }
        ],
        160,
        {
          address: '123 Test St',
          phone: '1234567890'
        },
        '',
        'cash on delivery',
        new Date('2023-01-02'),
        'processing'
      )
    ];

    service.getOrderHistory().subscribe(history => {
      expect(history).toEqual(mockOrderHistory);
    });

    const req = httpMock.expectOne('http://localhost:5000/orders/history?userId=user123');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrderHistory);
  });

  it('should cancel an order', () => {
    const orderId = 'order123';
    
    // Create mock response of the correct CartItem type
    const mockCartItemResponse: CartItem = {
      isSelected: false,
      productId: 'product1',
      quantity: 2,
      unit_price: 100,
      product_name: 'Test Product',
      userId: 'user123'
    };

    service.cancelOrder(orderId).subscribe(response => {
      expect(response).toEqual(mockCartItemResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/orders/cancel/${orderId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockCartItemResponse);
  });

  it('should save an order', () => {
    const orderData = {
      userId: 'user123',
      userName: 'Test User',
      items: [
        {
          product: {
            productId: 'product1',
            product_name: 'Test Product',
            quantity: 2,
            unit_price: 100,
            discount: 0,
            total_price: 200
          },
          quantity: 2
        }
      ],
      shippingMethod: [
        {
          estimated_delivery: '3-5 days',
          cost: 10
        }
      ],
      totalPrice: 210,
      contact: {
        address: '123 Test St',
        phone: '1234567890'
      },
      paymentMethod: 'credit card'
    };
    
    // Create mock response of the correct CartItem type
    const mockCartItemResponse: CartItem = {
      isSelected: true,
      productId: 'product1',
      quantity: 2,
      unit_price: 100,
      product_name: 'Test Product',
      userId: 'user123'
    };

    service.saveOrder(orderData).subscribe(response => {
      expect(response).toEqual(mockCartItemResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/orders/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(orderData);
    req.flush(mockCartItemResponse);
  });
});