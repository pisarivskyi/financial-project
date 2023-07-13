import { BaseModel } from '../../../core/supabase/models/base.model';
import {
  ApiGetExpanseRowData,
  ApiInsertExpanseRowData,
  ApiUpdateExpanseRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { CurrencyEnum } from '../../../shared/enums/currency.enum';
import { ExpanseCategory } from '../../expanse-categories/models/expanse-category.model';

export class ExpanseModel extends BaseModel {
  name!: string;
  amount!: number;
  category!: ExpanseCategory;
  createdBy!: UUID;
  currencyCode!: CurrencyEnum;

  constructor(data: ApiGetExpanseRowData) {
    super();

    super.toModel(data);

    this.toModel(data);
  }

  override toModel(data: ApiGetExpanseRowData): void {
    this.name = data.name;
    this.amount = data.amount;
    this.currencyCode = data.currency_code;
    this.category = new ExpanseCategory(data.category);
    this.createdBy = data.created_by;
  }

  static toInsertData(model: ExpanseModel): ApiInsertExpanseRowData {
    return {
      name: model.name,
      currency_code: model.currencyCode,
      amount: model.amount,
      category: model.category.id,
      created_by: model.createdBy,
    };
  }

  static toUpdateData(model: ExpanseModel): ApiUpdateExpanseRowData {
    return {
      name: model.name,
      currency_code: model.currencyCode,
      amount: model.amount,
      category: model.category.id,
    };
  }
}
