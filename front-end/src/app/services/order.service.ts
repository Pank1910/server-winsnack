// src/app/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order'; // API endpoint của backend

  constructor(private http: HttpClient) {}

  getUserOrders(userId: string): Observable<{ success: boolean, orders: Order[], hasOrders: boolean }> {
    return this.http.get<{ success: boolean, orders: Order[], hasOrders: boolean }>(`${this.apiUrl}/user/${userId}`);
  }
}
