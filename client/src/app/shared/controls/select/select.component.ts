import { Component, input } from '@angular/core';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ControlValueAccessorDirective } from '../directives/control-value-accessor.directive';
import { IControlItem } from '@app/models';

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [ReactiveFormsModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true },
  ],
})
export class SelectComponent<T> extends ControlValueAccessorDirective<T> {
  placeholder = input<string>();

  label = input.required<string>();

  id = input.required<string>();

  items = input.required<IControlItem[]>();
}
