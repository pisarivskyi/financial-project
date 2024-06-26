import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

import { UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>) {}

  async create(createCategoryDto: CreateCategoryDto, user: UserTokenParsedInterface): Promise<CategoryEntity> {
    const category = plainToInstance(CategoryEntity, createCategoryDto);
    category.createdBy = user.sub;

    let parentCategory: CategoryEntity;

    if (createCategoryDto.parentCategory) {
      try {
        parentCategory = await this.categoriesRepository.findOneBy({ id: createCategoryDto.parentCategory });
      } catch {
        throw new BadRequestException('No such parent category');
      }

      if (parentCategory) {
        category.parentCategory = parentCategory;
      }
    }

    return this.categoriesRepository.save(category);
  }

  async findAll(params: PageOptionsDto, user: UserTokenParsedInterface): Promise<PageDto<CategoryEntity>> {
    return paginate(this.categoriesRepository, params, {
      where: {
        createdBy: In([user.sub, 'SYSTEM']),
      },
      order: {
        createdAt: 'DESC',
      },
      relations: { parentCategory: true, merchantCategoryCodes: true },
    });
  }

  findByIds(ids: string[], user: UserTokenParsedInterface): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find({
      where: {
        id: In(ids),
        createdBy: In([user.sub, 'SYSTEM']),
      },
      relations: { parentCategory: true },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<CategoryEntity> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: {
          id,
          createdBy: In([user.sub, 'SYSTEM']),
        },
        relations: { parentCategory: true },
      });

      if (!category) {
        throw new Error();
      }

      return category;
    } catch {
      throw new NotFoundException();
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: UserTokenParsedInterface,
  ): Promise<CategoryEntity> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    if (updateCategoryDto.parentCategory) {
      const parentCategory = await this.categoriesRepository.findOne({
        where: {
          id: updateCategoryDto.parentCategory,
          createdBy: user.sub,
        },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category does not exist');
      }
    }

    const updatedCategory = plainToClassFromExist(targetCategory, updateCategoryDto);

    await this.categoriesRepository.update(id, updatedCategory);

    return this.findOne(id, user);
  }

  async remove(id: string, user: UserTokenParsedInterface): Promise<CategoryEntity> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    return this.categoriesRepository.remove(targetCategory);
  }
}
