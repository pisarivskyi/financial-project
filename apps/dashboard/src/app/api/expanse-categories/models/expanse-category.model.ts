import { BaseModel } from '../../../core/supabase/models/base.model';
import { ApiGetExpanseCategoryRowData } from '../../../core/supabase/types/table.types';

export class ExpanseCategory extends BaseModel {
  name!: string;

  constructor(data: ApiGetExpanseCategoryRowData) {
    super();

    super.toModel(data);

    this.toModel(data);
  }

  override toModel(data: ApiGetExpanseCategoryRowData): void {
    this.name = data.name;
  }
}
