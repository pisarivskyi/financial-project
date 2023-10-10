import { Pipe, PipeTransform } from '@angular/core';

import { AccountModel } from '../../../api/accounts/models/account.model';

@Pipe({
  name: 'getCreditCardBalance',
  standalone: true,
})
export class GetCreditCardBalancePipe implements PipeTransform {
  transform(account: AccountModel): number {
    return account.balance - account.creditLimit;
  }
}
