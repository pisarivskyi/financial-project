import { AccountType } from '../../api/accounts/enums/account-type.enum';

export const ACCOUNT_TYPE_OPTIONS = [
  {
    label: 'Cash',
    value: AccountType.Cash,
  },
  {
    label: 'Credit card',
    value: AccountType.CreditCard,
  },
  {
    label: 'Debit card',
    value: AccountType.DebitCard,
  },
];
