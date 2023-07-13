import { BaseModel } from '../../../core/supabase/models/base.model';
import {
  ApiGetExpanseCategoryRowData,
  ApiInsertExpanseCategoryRowData,
  ApiUpdateExpanseCategoryRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';

export class ExpanseCategory extends BaseModel {
  name!: string;
  createdBy!: UUID;

  constructor(data: ApiGetExpanseCategoryRowData) {
    super();

    super.toModel(data);

    this.toModel(data);
  }

  override toModel(data: ApiGetExpanseCategoryRowData): void {
    this.name = data.name;
    this.createdBy = data.created_by;
  }

  static toInsertData(model: ExpanseCategory): ApiInsertExpanseCategoryRowData {
    return {
      name: model.name,
      created_by: model.createdBy,
    };
  }

  static toUpdateData(model: ExpanseCategory): ApiUpdateExpanseCategoryRowData {
    return {
      name: model.name,
    };
  }
}
