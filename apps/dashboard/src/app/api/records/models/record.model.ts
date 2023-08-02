import { BaseModel } from '../../../core/supabase/models/base.model';
import {
  ApiGetRecordRowData,
  ApiInsertRecordRowData,
  ApiUpdateRecordRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { CurrencyEnum } from '../../../shared/enums/currency.enum';
import { Category } from '../../categories/models/category.model';

export class RecordModel extends BaseModel {
  name!: string;
  amount!: number;
  category!: Category;
  createdBy!: UUID;
  currencyCode!: CurrencyEnum;

  constructor(data: ApiGetRecordRowData) {
    super();

    super.toModel(data);

    this.toModel(data);
  }

  override toModel(data: ApiGetRecordRowData): void {
    this.name = data.name;
    this.amount = data.amount;
    this.currencyCode = data.currency_code;
    this.category = new Category(data.category);
    this.createdBy = data.created_by;
  }

  static toInsertData(model: RecordModel): ApiInsertRecordRowData {
    return {
      account: '', // TODO: implement field
      type: '', // TODO: implement field
      name: model.name,
      currency_code: model.currencyCode,
      amount: model.amount,
      category: model.category.id,
      created_by: model.createdBy
    };
  }

  static toUpdateData(model: RecordModel): ApiUpdateRecordRowData {
    return {
      name: model.name,
      currency_code: model.currencyCode,
      amount: model.amount,
      category: model.category.id,
    };
  }
}
