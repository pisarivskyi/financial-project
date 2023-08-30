import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

import { UserEntity } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>) {}

  async create(createCategoryDto: CreateCategoryDto, user: UserEntity): Promise<CategoryEntity> {
    const category = plainToInstance(CategoryEntity, createCategoryDto);
    category.createdBy = user;

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

  findAll(user: UserEntity): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find({
      where: {
        createdBy: {
          id: user.id,
        },
      },
      relations: { parentCategory: true, createdBy: true },
    });
  }

  findByIds(ids: string[], user: UserEntity): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find({
      where: {
        id: In(ids),
        createdBy: {
          id: user.id,
        },
      },
      relations: { parentCategory: true },
    });
  }

  async findOne(id: string, user: UserEntity): Promise<CategoryEntity> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: UserEntity): Promise<CategoryEntity> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: {
        id,
        createdBy: {
          id: user.id,
        },
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    if (updateCategoryDto.parentCategory) {
      const parentCategory = await this.categoriesRepository.findOne({
        where: {
          id: updateCategoryDto.parentCategory,
          createdBy: {
            id: user.id,
          },
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

  async remove(id: string, user: UserEntity): Promise<CategoryEntity> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: {
        id,
        createdBy: {
          id: user.id,
        },
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    return this.categoriesRepository.remove(targetCategory);
  }
}
