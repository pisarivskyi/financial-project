import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthenticationService } from '../../core/authentication/services/authentication.service';
import { CreateFormGroupFromData } from '../../shared/types/create-form-group-from-data.type';
import { updateValueAndValidity } from '../../shared/utils/form-utils';

export interface PasswordResetRequestData {
  email: string;
}

export type PasswordResetRequestFormGroup = CreateFormGroupFromData<PasswordResetRequestData>;

@Component({
  selector: 'fpd-password-reset-request-container',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  templateUrl: './password-reset-request-container.component.html',
  styleUrls: ['./password-reset-request-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetRequestContainerComponent implements OnInit {
  formGroup!: FormGroup<PasswordResetRequestFormGroup>;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<PasswordResetRequestFormGroup>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.authService.requestPasswordReset$(this.formGroup.getRawValue().email).subscribe();
    } else {
      updateValueAndValidity(this.formGroup.controls);
    }
  }
}
