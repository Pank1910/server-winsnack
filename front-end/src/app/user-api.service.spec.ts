import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserApiService } from './user-api.service';
import { User } from '../../../my-server-mongodb/interface/User';
import { Router } from '@angular/router';

describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUser: User = {
    _id: '1',
    avatar: 'avatar.jpg',
    userId: 'user123',
    profileName: 'Test User',
    email: 'test@example.com',
    role: 'user',
    action: 'just view',
    orderCount: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [UserApiService]
    });

    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Clear localStorage before each test
    localStorage.clear();
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and store user data', () => {
      const credentials = { profileName: 'testuser', password: 'password123' };
      const mockResponse = { success: true, user: mockUser, token: 'test-token' };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isLoggedIn()).toBeTrue();
        expect(service.getCurrentUser()).toEqual(mockUser);
      });

      const req = httpMock.expectOne('http://localhost:5000/user/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);

      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
    });

    it('should handle login error', () => {
      const credentials = { profileName: 'wrong', password: 'wrong' };
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.login(credentials).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.message).toBe('Tên đăng nhập hoặc mật khẩu không chính xác');
          expect(service.isLoggedIn()).toBeFalse();
        }
      });

      const req = httpMock.expectOne('http://localhost:5000/user/login');
      req.flush('Invalid credentials', errorResponse);
    });
  });

  describe('register', () => {
    it('should register user and store user data', () => {
      const userData = { profileName: 'newuser', password: 'password123' };
      const mockResponse = { success: true, user: mockUser, token: 'test-token' };

      service.register(userData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isLoggedIn()).toBeTrue();
        expect(service.getCurrentUser()).toEqual(mockUser);
      });

      const req = httpMock.expectOne('http://localhost:5000/user/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);

      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('checkUser', () => {
    it('should check and update current user', () => {
      // Setup current user in localStorage and service
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      (service as any).currentUserSubject.next(mockUser);

      service.checkUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`http://localhost:5000/user/profile?userId=${mockUser.userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when no user exists', () => {
      // Ensure no user in localStorage
      localStorage.removeItem('currentUser');
      (service as any).currentUserSubject.next(null);

      service.checkUser().subscribe({
        next: () => fail('should have failed with no user error'),
        error: (error) => {
          expect(error.message).toBe('Không có thông tin người dùng');
        }
      });

      // No HTTP request should be made
      httpMock.expectNone(`http://localhost:5000/user/profile`);
    });
  });

  describe('logout', () => {
    it('should clear user data and navigate to login', () => {
      // Setup logged in state
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      (service as any).currentUserSubject.next(mockUser);
      (service as any).isLoggedInSubject.next(true);

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.isLoggedIn()).toBeFalse();
      expect(service.getCurrentUser()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('user state checks', () => {
    it('should correctly identify admin role', () => {
      const adminUser: User = { ...mockUser, role: 'admin' };
      (service as any).currentUserSubject.next(adminUser);

      expect(service.isAdmin()).toBeTrue();
    });

    it('should correctly identify non-admin role', () => {
      (service as any).currentUserSubject.next(mockUser);

      expect(service.isAdmin()).toBeFalse();
    });

    it('should return correct user ID', () => {
      (service as any).currentUserSubject.next(mockUser);

      expect(service.getCurrentUserId()).toBe('user123');
    });

    it('should return correct user role', () => {
      (service as any).currentUserSubject.next(mockUser);

      expect(service.getUserRole()).toBe('user');
    });
  });
});