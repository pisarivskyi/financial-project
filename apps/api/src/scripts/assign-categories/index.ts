import { Logger } from '@nestjs/common';

import { CategoryEntity } from '../../app/categories/entities/category.entity';
import { connectionSource } from '../../app/configs/typeorm.config';
import { RecordEntity } from '../../app/records/entities/record.entity';

const logger = new Logger('Assign categories');

async function assign() {
  await connectionSource.initialize();

  const queryRunner = await connectionSource.createQueryRunner();

  logger.log('Connected');

  const recordsRepository = queryRunner.connection.getRepository(RecordEntity);
  const categoriesRepository = queryRunner.connection.getRepository(CategoryEntity);

  const users = await recordsRepository.query('SELECT "createdBy"  FROM public.records group by "createdBy";');

  const systemCategories = await categoriesRepository.find({
    where: {
      createdBy: 'SYSTEM',
    },
    relations: {
      merchantCategoryCodes: true,
    },
  });

  const mccToSystemCategory = new Map<number, CategoryEntity>();

  for (const systemCategory of systemCategories) {
    for (const mcc of systemCategory.merchantCategoryCodes) {
      mccToSystemCategory.set(mcc.code, systemCategory);
    }
  }

  for (const user of users) {
    const records = await recordsRepository.find({
      where: {
        createdBy: user.createdBy,
      },
    });

    const categories = await categoriesRepository.find({
      where: {
        createdBy: user.createdBy,
      },
      relations: {
        merchantCategoryCodes: true,
      },
    });

    const mccToCategory = new Map<number, CategoryEntity>();

    for (const category of categories) {
      for (const mcc of category.merchantCategoryCodes) {
        mccToCategory.set(mcc.code, category);
      }
    }

    for (const record of records) {
      const systemCategory = mccToSystemCategory.get(record.mcc);
      const userCategory = mccToCategory.get(record.mcc);

      if (systemCategory) {
        record.category = systemCategory;
      } else if (userCategory) {
        record.category = userCategory;
      } else {
        logger.warn(`no category for MCC: ${record.mcc}`);
      }
    }

    await recordsRepository.save(records);
  }

  await connectionSource.destroy();
}

assign().then(() => logger.log('Done'));
