import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { PeriodEnum, UserTokenParsedInterface } from '@financial-project/common';

import { CategoriesService } from '../categories/categories.service';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetEntity } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(BudgetEntity) private budgetsRepository: Repository<BudgetEntity>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createBudgetDto: CreateBudgetDto, user: UserTokenParsedInterface): Promise<BudgetEntity> {
    const budget = plainToInstance(BudgetEntity, createBudgetDto, { excludeExtraneousValues: true });
    budget.createdBy = user.sub;

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

  findAll(params: PageOptionsDto, user: UserTokenParsedInterface): Promise<PageDto<BudgetEntity>> {
    return paginate(this.budgetsRepository, params, {
      where: {
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: { categories: true },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<BudgetEntity> {
    try {
      const targetBudget = await this.budgetsRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
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

  async update(id: string, updateBudgetDto: UpdateBudgetDto, user: UserTokenParsedInterface): Promise<BudgetEntity> {
    const targetBudget = await this.budgetsRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetBudget) {
      throw new NotFoundException();
    }

    const updatedBudget = plainToClassFromExist(targetBudget, updateBudgetDto, { excludeExtraneousValues: true });

    if (updateBudgetDto.period === PeriodEnum.OneTime) {
      updatedBudget.fromDate = updateBudgetDto.fromDate;
      updatedBudget.toDate = updateBudgetDto.toDate;
    }

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

  async remove(id: string, user: UserTokenParsedInterface): Promise<BudgetEntity> {
    const targetBudget = await this.budgetsRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetBudget) {
      throw new NotFoundException();
    }

    return this.budgetsRepository.remove(targetBudget);
  }
}
