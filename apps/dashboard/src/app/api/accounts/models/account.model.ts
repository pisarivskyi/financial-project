import { Expose, instanceToPlain } from 'class-transformer';

import { BaseModel } from '../../../core/supabase/models/base.model';
import { ApiInsertAccountRowData, ApiUpdateAccountRowData } from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { AccountType } from '../enums/account-type.enum';
import { ProviderEnum } from '../enums/provider.enum';

export class Account extends BaseModel {
  @Expose()
  name!: string;

  @Expose()
  balance!: string;

  @Expose({ name: 'created_by' })
  createdBy!: UUID;

  @Expose()
  type!: AccountType;

  @Expose()
  provider!: ProviderEnum;

  @Expose({ name: 'bank_specific_type' })
  bankSpecificType?: string;

  @Expose()
  color?: string;

  @Expose()
  metadata!: JSON;

  toInsertData(): ApiInsertAccountRowData {
    const { name, created_by, provider, type, balance, color }: Record<keyof ApiInsertAccountRowData, any> = instanceToPlain(this);

    return {
      name,
      created_by,
      provider,
      type,
      balance,
      color,
    };
  }

  toUpdateData(): ApiUpdateAccountRowData {
    const { name }: Record<keyof ApiInsertAccountRowData, any> = instanceToPlain(this);

    return {
      name,
    };
  }
}
