// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AddressService } from '../services/address.service';
// import { Address } from '../models/address.model';

// @Component({
//   selector: 'app-payment-address',
//   templateUrl: './payment-address.component.html',
//   styleUrls: ['./payment-address.component.css']
// })
// export class PaymentAddressComponent implements OnInit {
//   addressList: Address[] = [];

//   constructor(
//     private addressService: AddressService,
//     private router: Router
//   ) { }

//   ngOnInit() {
//     this.getAddressList();
//   }

//   getAddressList() {
//     this.addressService.getUserAddress().subscribe(data => {
//       this.addressList = [];
//       data['data'].forEach((element: { [key: string]: any }) => {
//         const address = new Address(element);
//         this.addressList.push(address);
//       });
//       this.sortDefaultAddressFirst();
//     });
//   }

//   sortDefaultAddressFirst() {
//     this.addressList.sort((a, b) => {
//       if (a.isDefault === true) return -1;
//       if (b.isDefault === true) return 1;
//       return 0;
//     });
//   }

//   editAddress(addressId: string) {
//     // Implement edit address logic
//     this.router.navigate(['/payment-change-address', addressId]);
//   }

//   deleteAddress(addressId: string) {
//     // Implement delete address logic
//     if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
//       this.addressService.deleteAddress(addressId).subscribe(() => {
//         this.getAddressList();
//       });
//     }
//   }

//   addNewAddress() {
//     this.router.navigate(['/payment-new-address']);
//   }

//   goBack() {
//     this.router.navigate(['/payment']);
//   }

//   complete() {
//     // Implement complete logic
//     this.router.navigate(['/payment']);
//   }
// }