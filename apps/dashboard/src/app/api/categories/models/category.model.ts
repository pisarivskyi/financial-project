import { BaseModel } from '../../../core/supabase/models/base.model';
import {
  ApiGetCategoryRowData,
  ApiInsertCategoryRowData,
  ApiUpdateCategoryRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';

export class Category extends BaseModel {
  name!: string;
  createdBy!: UUID;

  constructor(data: ApiGetCategoryRowData) {
    super();

    super.toModel(data);

    this.toModel(data);
  }

  override toModel(data: ApiGetCategoryRowData): void {
    this.name = data.name;
    this.createdBy = data.created_by;
  }

  static toInsertData(model: Category): ApiInsertCategoryRowData {
    return {
      name: model.name,
      created_by: model.createdBy,
    };
  }

  static toUpdateData(model: Category): ApiUpdateCategoryRowData {
    return {
      name: model.name,
    };
  }
}
