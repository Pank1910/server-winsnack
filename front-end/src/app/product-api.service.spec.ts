import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApiService } from './product-api.service';
import { Product } from '../../../my-server-mongodb/interface/Product';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductApiService]
    });
    service = TestBed.inject(ProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockResponse = {
      success: true,
      data: [
        new Product('1', 'prod-1', 'Product 1', 'Detail 1', 10, 100, 0.1, '2023-01-01', '', '', '', '', '', 'dept1', 4, false)
      ],
      count: 1
    };

    service.getAllProducts().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get products by category', () => {
    const category = 'electronics';
    const mockResponse = {
      success: true,
      data: [
        new Product('1', 'prod-1', 'Product 1', 'Detail 1', 10, 100, 0.1, '2023-01-01', '', '', '', '', '', 'electronics', 4, false)
      ],
      count: 1
    };

    service.getProductsByCategory(category).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/products?category=${encodeURIComponent(category)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get product by id', () => {
    const id = '1';
    const mockResponse = {
      success: true,
      data: new Product('1', 'prod-1', 'Product 1', 'Detail 1', 10, 100, 0.1, '2023-01-01', '', '', '', '', '', 'dept1', 4, false)
    };

    service.getProductById(id).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/products/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get featured products', () => {
    const mockResponse = [
      new Product('1', 'prod-1', 'Product 1', 'Detail 1', 10, 100, 0.1, '2023-01-01', '', '', '', '', '', 'dept1', 4, false)
    ];

    service.getFeaturedProducts().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/products/featured');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get bestseller products', () => {
    const mockResponse = [
      new Product('1', 'prod-1', 'Product 1', 'Detail 1', 10, 100, 0.1, '2023-01-01', '', '', '', '', '', 'dept1', 4, false)
    ];

    service.getBestSellerProducts().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/products/bestseller');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search products', () => {
    const term = 'product';
    const mockResponse = {
      success: true,
      data: [
        new Product('1', 'prod-1', 'Product 1', 'Detail 1', 10, 100, 0.1, '2023-01-01', '', '', '', '', '', 'dept1', 4, false)
      ],
      count: 1
    };

    service.searchProducts(term).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/products/search?term=${encodeURIComponent(term)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});