import { Injectable, Logger } from '@nestjs/common';

import { CategoryEntity } from '../../categories/entities/category.entity';
import { RecordEntity } from '../../records/entities/record.entity';

@Injectable()
export class CategoryAssignerService {
  private readonly logger = new Logger(CategoryAssignerService.name);

  assignCategories(records: RecordEntity[], categories: CategoryEntity[]): RecordEntity[] {
    const mccToCategory = new Map<number, CategoryEntity>();

    for (const category of categories) {
      for (const mcc of category.merchantCategoryCodes) {
        mccToCategory.set(mcc.code, category);
      }
    }

    for (const record of records) {
      const category = mccToCategory.get(record.mcc);

      if (category) {
        record.category = category;
      } else {
        this.logger.warn(`no category for MCC: ${record.mcc}`);
      }
    }

    return records;
  }
}
