import { AbstractControl } from '@angular/forms';

export function updateValueAndValidity(controls: { [p: string]: AbstractControl }): void {
  Object.values(controls).forEach((control) => {
    if (control.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  });
}
