import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { CategoriesService } from '../categories/categories.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetEntity } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(BudgetEntity) private budgetsRepository: Repository<BudgetEntity>,
    private categoriesService: CategoriesService
  ) {}

  async create(createBudgetDto: CreateBudgetDto, user: UserEntity): Promise<BudgetEntity> {
    const budget = plainToInstance(BudgetEntity, createBudgetDto, { excludeExtraneousValues: true });
    budget.createdBy = user;

    try {
      const categories = await this.categoriesService.findByIds(createBudgetDto.categoryIds, user);

      if (categories.length !== createBudgetDto.categoryIds.length) {
        throw new Error();
      }

      budget.categories = categories;
    } catch {
      throw new BadRequestException('Not all categories found');
    }

    return this.budgetsRepository.save(budget);
  }

  findAll(user: UserEntity): Promise<BudgetEntity[]> {
    return this.budgetsRepository.find({
      where: {
        createdBy: {
          id: user.id,
        },
      },
      relations: { categories: true },
    });
  }

  async findOne(id: string, user: UserEntity): Promise<BudgetEntity> {
    try {
      const targetBudget = await this.budgetsRepository.findOne({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
        relations: { categories: true },
      });

      if (!targetBudget) {
        throw new Error();
      }

      return targetBudget;
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, user: UserEntity): Promise<BudgetEntity> {
    const targetBudget = await this.budgetsRepository.findOne({
      where: {
        id,
        createdBy: {
          id: user.id,
        },
      },
    });

    if (!targetBudget) {
      throw new NotFoundException();
    }

    const updatedBudget = plainToClassFromExist(targetBudget, updateBudgetDto, { excludeExtraneousValues: true });

    if (updateBudgetDto.categoryIds?.length) {
      try {
        const categories = await this.categoriesService.findByIds(updateBudgetDto.categoryIds, user);

        if (categories.length !== updateBudgetDto.categoryIds.length) {
          throw new Error();
        }

        updatedBudget.categories = categories;
      } catch {
        throw new BadRequestException('Not all categories found');
      }
    }

    await this.budgetsRepository.save(updatedBudget);

    return this.findOne(id, user);
  }

  async remove(id: string, user: UserEntity): Promise<BudgetEntity> {
    const targetBudget = await this.budgetsRepository.findOne({
      where: {
        id,
        createdBy: {
          id: user.id,
        },
      },
    });

    if (!targetBudget) {
      throw new NotFoundException();
    }

    return this.budgetsRepository.remove(targetBudget);
  }
}
