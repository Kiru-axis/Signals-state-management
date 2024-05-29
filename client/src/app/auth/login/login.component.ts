import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import {
  FormGroupComponent,
  InputComponent,
  PasswordComponent,
  markFormGroupTouched,
  regex,
  regexErrors,
} from '@app/shared';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    FormGroupComponent,
    PasswordComponent,
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class LoginComponent {
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  regexErrors = regexErrors;

  form = this.fb.group({
    email: [
      'admin@gmail.com',
      [Validators.required, Validators.pattern(regex.email)],
    ],
    password: [
      'Pass1234.',
      [
        Validators.required,
        Validators.min(4),
        Validators.pattern(regex.password),
      ],
    ],
  });

  login() {
    if (this.form.valid) {
      this.authService.login$.next({
        email: String(this.form.value.email),
        password: String(this.form.value.password),
      });
    } else {
      markFormGroupTouched(this.form);
      return;
    }
  }
}
