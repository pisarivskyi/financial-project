import { Expose, Type, instanceToPlain } from 'class-transformer';

import { BaseModel } from '../../../core/supabase/models/base.model';
import { ApiInsertRecordRowData, ApiUpdateRecordRowData } from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { CurrencyEnum } from '../../../shared/enums/currency.enum';
import { Category } from '../../categories/models/category.model';

export class RecordModel extends BaseModel {
  @Expose()
  name!: string;

  @Expose()
  amount!: number;

  @Expose()
  @Type(() => Category)
  category!: Category;

  @Expose({ name: 'created_by' })
  createdBy!: UUID;

  @Expose({ name: 'currency_code' })
  currencyCode!: CurrencyEnum;

  toInsertData(): ApiInsertRecordRowData {
    const {
      account,
      type,
      name,
      currency_code,
      amount,
      category,
      created_by,
    }: Record<keyof ApiInsertRecordRowData, any> = instanceToPlain(this);

    return {
      account, // TODO: implement field
      type, // TODO: implement field
      name,
      currency_code,
      amount,
      category: category.id,
      created_by: created_by,
    };
  }

  toUpdateData(): ApiUpdateRecordRowData {
    const { account, type, name, currency_code, amount, category }: Record<keyof ApiUpdateRecordRowData, any> =
      instanceToPlain(this);

    return {
      name,
      currency_code,
      amount,
      category: category.id,
    };
  }
}
