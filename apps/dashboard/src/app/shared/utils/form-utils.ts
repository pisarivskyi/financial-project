import { AbstractControl } from '@angular/forms';

export function updateValueAndValidity(controls: Record<string, AbstractControl>): void {
  Object.values(controls).forEach((control) => {
    if (control.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  });
}
