import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateDateOfStart(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.get('dateOfStart');

    if (!date?.value) return null;
    // console.log(date);

    if (date.value && +new Date(date.value) - +new Date() < 0) {
      date.setErrors({ pwMatch: true });
      return { pwMatch: true };
    }

    console.log(+new Date(date.value) - +new Date());

    return null;
  };
}

// export function passwordMatchValidator(): ValidatorFn {
//   return (form: AbstractControl): ValidationErrors | null => {
//     const confirm_password = form.get('confirm_password');
//     const password = form.get('password');

//     if (
//       password &&
//       confirm_password &&
//       confirm_password.value !== password.value
//     ) {
//       confirm_password.setErrors({ pwMatch: true });
//       return { pwMatch: true };
//     }

//     return null;
//   };
// }
