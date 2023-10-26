import { Logger } from '@nestjs/common';

import { connectionSource } from '../app/configs/typeorm.config';
import { MerchantCategoryCodeEntity } from '../app/merchant-category-codes/entities/merchant-category-code.entity';
import { INITIAL_MCC_DATA } from './data/mcc-data';

const logger = new Logger('MCCs generator');

export async function seed() {
  await connectionSource.initialize();

  logger.log('Connected');

  const mccEntityRepository = await connectionSource
    .createQueryRunner()
    .connection.getRepository(MerchantCategoryCodeEntity);

  for (const mccData of INITIAL_MCC_DATA) {
    const mccEntity = await mccEntityRepository.create({
      ...mccData,
      name: mccData.description,
      categories: mccData.categoriesId.map((id) => ({ id })),
    });

    await mccEntityRepository.save(mccEntity);
  }

  await connectionSource.destroy();
}
