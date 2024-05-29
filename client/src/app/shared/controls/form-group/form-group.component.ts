import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.scss',
})
export class FormGroupComponent {
  control = input.required<AbstractControl>();

  patternError = input<string>();

  hasError() {
    return this.control() && this.control().invalid && this.control().touched;
  }

  get errorKey() {
    return (
      this.control() &&
      this.control().errors &&
      Object.keys(this.control().errors as any)[0]
    );
  }
}
