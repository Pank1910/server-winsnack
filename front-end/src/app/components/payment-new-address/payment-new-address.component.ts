// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AddressService } from '../services/address.service';
// import { AuthService } from '../services/auth.service';
// import { User } from '../models/user.model';
// import { Location } from '@angular/common';

// @Component({
//   selector: 'app-new-address',
//   templateUrl: './new-address.component.html',
//   styleUrls: ['./new-address.component.css']
// })
// export class NewAddressComponent implements OnInit {
//   addressForm: FormGroup;
//   provinces: any[] = [];
//   user: User | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private addressService: AddressService,
//     private authService: AuthService,
//     private router: Router,
//     private location: Location
//   ) {
//     this.addressForm = this.fb.group({
//       fullName: ['', Validators.required],
//       phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
//       province: ['', Validators.required],
//       district: ['', Validators.required],
//       ward: ['', Validators.required],
//       street: ['', Validators.required],
//       isDefault: [false]
//     });
//   }

//   ngOnInit(): void {
//     this.loadUser();
//     this.loadProvinces();
//     this.setupFormListeners();
//   }

//   private loadUser(): void {
//     this.authService.checkUser().subscribe(
//       response => {
//         this.user = new User(response.data);
//       },
//       error => {
//         console.error('Error loading user:', error);
//         this.router.navigate(['/login']);
//       }
//     );
//   }

//   private loadProvinces(): void {
//     this.addressService.getProvinces().subscribe(
//       data => {
//         this.provinces = data;
//       },
//       error => console.error('Error loading provinces:', error)
//     );
//   }

//   private setupFormListeners(): void {
//     this.addressForm.get('province')?.valueChanges.subscribe(() => {
//       this.addressForm.patchValue({
//         district: '',
//         ward: ''
//       });
//     });

//     this.addressForm.get('district')?.valueChanges.subscribe(() => {
//       this.addressForm.patchValue({
//         ward: ''
//       });
//     });
//   }

//   get districts() {
//     const provinceName = this.addressForm.get('province')?.value;
//     return this.provinces.find(p => p.name === provinceName)?.districts || [];
//   }

//   get wards() {
//     const districtName = this.addressForm.get('district')?.value;
//     return this.districts.find((d: any) => d.name === districtName)?.wards || [];
//   }

//   goBack(): void {
//     this.location.back();
//   }

//   onSubmit(): void {
//     if (this.addressForm.valid && this.user) {
//       const formValue = this.addressForm.value;
      
//       const addressData = {
//         name: formValue.fullName,
//         phone: formValue.phoneNumber,
//         street: formValue.street,
//         ward: formValue.ward,
//         district: formValue.district,
//         city: formValue.province,
//         default: formValue.isDefault,
//         user: this.user.userID
//       };

//       this.addressService.createAddress(addressData).subscribe(
//         response => {
//           console.log('Address created successfully:', response);
//           this.router.navigate(['/payment']);
//         },
//         error => {
//           console.error('Error creating address:', error);
//           // Handle error (show message to user)
//         }
//       );
//     }
//   }
// }
