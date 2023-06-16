import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthenticationService } from '../../core/authentication/services/authentication.service';

@Component({
  selector: 'fpd-sign-in-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInPageComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup<{ email: FormControl<string>; password: FormControl<string>; }>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.authService.signIn(this.formGroup.getRawValue()).subscribe()
    }
  }
}
