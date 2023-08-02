import { Expose, instanceToPlain } from 'class-transformer';

import { BaseModel } from '../../../core/supabase/models/base.model';
import { ApiInsertCategoryRowData, ApiUpdateCategoryRowData } from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';

export class Category extends BaseModel {
  @Expose()
  name!: string;

  @Expose({ name: 'created_by' })
  createdBy!: UUID;

  toInsertData(): ApiInsertCategoryRowData {
    const plain = instanceToPlain(this);

    return {
      name: plain['name'],
      created_by: plain['created_by'],
    };
  }

  toUpdateData(): ApiUpdateCategoryRowData {
    const plain = instanceToPlain(this);

    return {
      name: plain['name'],
    };
  }
}
