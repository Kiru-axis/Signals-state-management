import { Component, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { ControlValueAccessorDirective } from '../directives/control-value-accessor.directive';

export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'date'
  | 'number'
  | 'checkbox'
  | 'radio'
  | 'file';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  imports: [ReactiveFormsModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  placeholder = input<string>();

  label = input.required<string>();

  id = input.required<string>();

  type = input<InputType>('text');

  hasError() {
    return this.control && this.control.invalid && this.control.touched;
  }
}
