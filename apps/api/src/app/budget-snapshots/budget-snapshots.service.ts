import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { UserTokenParsedInterface } from '@financial-project/common';

import { BudgetEntity } from '../budgets/entities/budget.entity';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { CreateBudgetSnapshotDto } from './dto/create-budget-snapshot.dto';
import { BudgetSnapshotEntity } from './entities/budget-snapshot.entity';

@Injectable()
export class BudgetSnapshotsService {
  constructor(
    @InjectRepository(BudgetSnapshotEntity)
    private budgetSnapshotEntityRepository: Repository<BudgetSnapshotEntity>,
    @InjectRepository(BudgetEntity) private budgetEntityRepository: Repository<BudgetEntity>,
  ) {}

  async create(
    createCategoryDto: CreateBudgetSnapshotDto,
    user: UserTokenParsedInterface,
  ): Promise<BudgetSnapshotEntity> {
    const originalBudget = await this.budgetEntityRepository.findOne({
      where: {
        id: createCategoryDto.originalId,
        createdBy: user.sub,
      },
      relations: { categories: true },
    });

    if (!originalBudget) {
      throw new NotFoundException('Budget is not found');
    }

    const cloneData = instanceToPlain(originalBudget);

    delete cloneData.id;

    return this.budgetSnapshotEntityRepository.save({
      ...cloneData,
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
}
