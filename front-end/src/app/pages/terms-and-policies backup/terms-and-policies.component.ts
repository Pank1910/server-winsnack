import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-and-policies',
  standalone: true,
  templateUrl: './terms-and-policies.component.html',
  imports: [RouterModule] // Quan trọng để sử dụng router-outlet
})
export class TermsAndPoliciesComponent { }
