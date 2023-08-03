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
    const { name, created_by }: Record<keyof ApiInsertCategoryRowData, any> = instanceToPlain(this);

    return {
      name,
      created_by,
    };
  }

  toUpdateData(): ApiUpdateCategoryRowData {
    const { name }: Record<keyof ApiInsertCategoryRowData, any> = instanceToPlain(this);

    return {
      name,
    };
  }
}
