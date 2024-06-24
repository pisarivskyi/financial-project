import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { PeriodEnum, UserTokenParsedInterface } from '@financial-project/common';

import { BudgetEntity } from '../budgets/entities/budget.entity';
import { CategoriesService } from '../categories/categories.service';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { CreateBudgetSnapshotDto } from './dto/create-budget-snapshot.dto';
import { UpdateBudgetSnapshotDto } from './dto/update-budget-snapshot.dto';
import { BudgetSnapshotEntity } from './entities/budget-snapshot.entity';

@Injectable()
export class BudgetSnapshotsService {
  constructor(
    @InjectRepository(BudgetSnapshotEntity)
    private budgetSnapshotEntityRepository: Repository<BudgetSnapshotEntity>,
    @InjectRepository(BudgetEntity)
    private budgetEntityRepository: Repository<BudgetEntity>,
    private categoriesService: CategoriesService,
  ) {}

  async create(
    createCategoryDto: CreateBudgetSnapshotDto,
    user: UserTokenParsedInterface,
  ): Promise<BudgetSnapshotEntity> {
    const originalBudget = await this.budgetEntityRepository.findOne({
      where: {
        id: createCategoryDto.id,
        createdBy: user.sub,
      },
      relations: { categories: true },
    });

    if (!originalBudget) {
      throw new NotFoundException('Budget is not found');
    }

    const budgetSnapshot = plainToInstance(BudgetSnapshotEntity, createCategoryDto, { excludeExtraneousValues: true });
    budgetSnapshot.createdBy = user.sub;

    try {
      const categories = await this.categoriesService.findByIds(createCategoryDto.categoryIds, user);

      if (categories.length !== createCategoryDto.categoryIds.length) {
        throw new Error();
      }

      budgetSnapshot.categories = categories;
    } catch {
      throw new BadRequestException('Not all categories found');
    }

    delete budgetSnapshot.id;

    return this.budgetSnapshotEntityRepository.save({
      ...budgetSnapshot,
      original: originalBudget,
    });
  }

  async findAll(params: PageOptionsDto, user: UserTokenParsedInterface): Promise<PageDto<BudgetSnapshotEntity>> {
    return paginate(this.budgetSnapshotEntityRepository, params, {
      where: {
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: { categories: true },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<BudgetSnapshotEntity> {
    try {
      const plannedPaymentEntity = await this.budgetSnapshotEntityRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
        },
        relations: { categories: true, original: true },
      });

      if (!plannedPaymentEntity) {
        throw new Error();
      }

      return plannedPaymentEntity;
    } catch {
      throw new NotFoundException();
    }
  }

  async remove(id: string, user: UserTokenParsedInterface): Promise<BudgetSnapshotEntity> {
    const targetCategory = await this.budgetSnapshotEntityRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    return this.budgetSnapshotEntityRepository.remove(targetCategory);
  }

  async update(
    id: string,
    updateBudgetSnapshotDto: UpdateBudgetSnapshotDto,
    user: UserTokenParsedInterface,
  ): Promise<BudgetSnapshotEntity> {
    const targetBudget = await this.budgetSnapshotEntityRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetBudget) {
      throw new NotFoundException();
    }

    const updatedBudget = plainToClassFromExist(targetBudget, updateBudgetSnapshotDto, {
      excludeExtraneousValues: true,
    });

    if (updateBudgetSnapshotDto.period === PeriodEnum.OneTime) {
      updatedBudget.fromDate = updateBudgetSnapshotDto.fromDate;
      updatedBudget.toDate = updateBudgetSnapshotDto.toDate;
    }

    if (updateBudgetSnapshotDto.categoryIds?.length) {
      try {
        const categories = await this.categoriesService.findByIds(updateBudgetSnapshotDto.categoryIds, user);

        if (categories.length !== updateBudgetSnapshotDto.categoryIds.length) {
          throw new Error();
        }

        updatedBudget.categories = categories;
      } catch {
        throw new BadRequestException('Not all categories found');
      }
    }

    await this.budgetSnapshotEntityRepository.save(updatedBudget);

    return this.findOne(id, user);
  }
}
