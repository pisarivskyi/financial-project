import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { AuthenticationService } from '../../core/authentication/services/authentication.service';
import { RoutePathEnum } from '../../core/enums/route-path.enum';

@Component({
  selector: 'fpd-sign-in-container',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './sign-in-container.component.html',
  styleUrls: ['./sign-in-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInContainerComponent implements OnInit {
  formGroup!: FormGroup;

  protected readonly RoutePathEnum = RoutePathEnum;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<{
      email: FormControl<string>;
      password: FormControl<string>;
    }>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.authService.signIn$(this.formGroup.getRawValue()).subscribe();
    }
  }
}
