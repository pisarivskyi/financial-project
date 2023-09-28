import { AccountTypeEnum } from '@financial-project/common';

export const ACCOUNT_TYPE_OPTIONS = [
  {
    label: 'Cash',
    value: AccountTypeEnum.Cash,
  },
  {
    label: 'Credit card',
    value: AccountTypeEnum.CreditCard,
  },
  {
    label: 'Debit card',
    value: AccountTypeEnum.DebitCard,
  },
];
