import { AccountInterface } from '@financial-project/common';

export type UpdateAccountDataType = Partial<Pick<AccountInterface, 'name'>>;
