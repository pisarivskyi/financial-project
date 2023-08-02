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
    const plain = instanceToPlain(this);

    return {
      account: '', // TODO: implement field
      type: '', // TODO: implement field
      name: plain['name'],
      currency_code: plain['currency_code'],
      amount: plain['amount'],
      category: plain['category'].id,
      created_by: plain['created_by'],
    };
  }

  toUpdateData(): ApiUpdateRecordRowData {
    const plain = instanceToPlain(this);

    return {
      name: plain['name'],
      currency_code: plain['currency_code'],
      amount: plain['amount'],
      category: plain['category'].id,
    };
  }
}
