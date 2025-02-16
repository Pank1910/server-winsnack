import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private apiUrl = 'http://localhost:8080/api/addresses'; // URL API trực tiếp

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    getUserAddress(): Observable<any> {
        return this.http.get(this.apiUrl, { headers: this.getHeaders() });
    }

    // addAddress(address: Address): Observable<any> {
    //     return this.http.post(this.apiUrl, address, { headers: this.getHeaders() });
    // }

    // updateAddress(addressID: string, address: Address): Observable<any> {
    //     return this.http.put(`${this.apiUrl}/${addressID}`, address, { headers: this.getHeaders() });
    // }

    deleteAddress(addressID: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${addressID}`, { headers: this.getHeaders() });
    }

    setDefaultAddress(addressID: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${addressID}/default`, {}, { headers: this.getHeaders() });
    }
}
