import { Component, input } from '@angular/core';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ControlValueAccessorDirective } from '../directives/control-value-accessor.directive';

type PasswordType = 'text' | 'password';

@Component({
  selector: 'app-password',
  standalone: true,
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  imports: [ReactiveFormsModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: PasswordComponent, multi: true },
  ],
})
export class PasswordComponent<T> extends ControlValueAccessorDirective<T> {
  placeholder = input<string>();

  label = input.required<string>();

  id = input.required<string>();

  type: PasswordType = 'password';

  togglePassword(): void {
    this.type = this.type === 'password' ? 'text' : 'password';
  }
}
