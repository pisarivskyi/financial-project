import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CategoryEntity } from '../app/categories/entities/category.entity';
import { connectionSource } from '../app/configs/typeorm.config';
import { CategoryNodeInterface, INITIAL_CATEGORIES } from './data/categories-data';

const logger = new Logger('Seed generator');

export async function seed() {
  await connectionSource.initialize();

  logger.log('Connected');

  const categoryEntityRepository = await connectionSource.createQueryRunner().connection.getRepository(CategoryEntity);

  for (const categoryNode of INITIAL_CATEGORIES) {
    await createCategoryTree(categoryEntityRepository, categoryNode);
  }

  await connectionSource.destroy();
}

async function createCategoryTree(
  categoryEntityRepository: Repository<CategoryEntity>,
  categoryNode: CategoryNodeInterface,
  parentCategory: CategoryEntity = undefined
): Promise<any> {
  let category = categoryEntityRepository.create(categoryNode.node);

  if (parentCategory) {
    category.parentCategory = parentCategory;
  }

  category = await categoryEntityRepository.save(category);

  logger.log(`Creating category ${category.name}`);

  if (categoryNode.children?.length) {
    for (const childCategoryNode of categoryNode.children) {
      await createCategoryTree(categoryEntityRepository, childCategoryNode, category);
    }
  }
}

// seed().then(() => logger.log('Done'));
