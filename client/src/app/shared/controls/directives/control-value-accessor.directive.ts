import { Directive, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  Validators,
} from '@angular/forms';
import { Subject, distinctUntilChanged, startWith, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
  standalone: true,
})
export class ControlValueAccessorDirective<T>
  implements OnInit, OnDestroy, ControlValueAccessor
{
  constructor(@Inject(Injector) private injector: Injector) {}

  control: FormControl | undefined;

  required = false;

  isDisabled = false;

  destroy$ = new Subject();

  private propagateTouched!: () => T;

  ngOnInit(): void {
    this.setFormControl();
    this.required = this.control?.hasValidator(Validators.required) ?? false;
  }

  setFormControl(): void {
    const ngControl = this.injector.get(NgControl);

    try {
      switch (ngControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(ngControl as FormControlName);

          break;

        default:
          this.control = (ngControl as FormControlDirective)
            .form as FormControl;
          break;
      }
    } catch (error) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    this.control
      ? this.control?.setValue(value)
      : (this.control = new FormControl(value));
  }

  registerOnChange(fn: (value: T | null) => T): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        tap((val) => fn(val))
      )
      .subscribe();
  }

  registerOnTouched(fn: () => T): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }
}
