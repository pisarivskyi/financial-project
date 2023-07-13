import { FormControl } from '@angular/forms';

export type CreateFormGroupFromData<T> = {
  [Key in keyof T]: FormControl<T[Key]>;
};
