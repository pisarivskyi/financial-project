import { BaseModel } from '../../../core/supabase/models/base.model';
import { ApiGetExpanseRowData } from '../../../core/supabase/types/table.types';

export class ExpanseModel extends BaseModel {
  name!: string;
  amount!: number;
  currency!: string;

  constructor(data: ApiGetExpanseRowData) {
    super();

    super.toModel(data);

    this.toModel(data);
  }

  override toModel(data: ApiGetExpanseRowData): void {
    this.name = data.name;
    this.amount = data.amount;
    this.currency = data.currency;
  }
}
