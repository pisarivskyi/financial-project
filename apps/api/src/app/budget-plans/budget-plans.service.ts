import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserTokenParsedInterface } from '@financial-project/common';

import { BudgetSnapshotEntity } from '../budget-snapshots/entities/budget-snapshot.entity';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { PlannedPaymentSnapshotEntity } from '../planned-payment-snapshots/entities/planned-payment-snapshot.entity';
import { CreateBudgetPlanDto } from './dto/create-budget-plan.dto';
import { BudgetPlanEntity } from './entities/budget-plan.entity';

@Injectable()
export class BudgetPlansService {
  constructor(
    @InjectRepository(BudgetPlanEntity)
    private budgetPlanEntityRepository: Repository<BudgetPlanEntity>,
    @InjectRepository(PlannedPaymentSnapshotEntity)
    private plannedPaymentSnapshotEntityRepository: Repository<PlannedPaymentSnapshotEntity>,
    @InjectRepository(BudgetSnapshotEntity)
    private budgetSnapshotEntityRepository: Repository<BudgetSnapshotEntity>,
  ) {}

  async create(createBudgetPlanDto: CreateBudgetPlanDto, user: UserTokenParsedInterface): Promise<BudgetPlanEntity> {
    const existingBudgetPlan = await this.budgetPlanEntityRepository.findOne({
      where: {
        year: createBudgetPlanDto.year,
        month: createBudgetPlanDto.month,
        createdBy: user.sub,
      },
    });

    if (existingBudgetPlan) {
      throw new BadRequestException('Budget plan already exists');
    }

    const budgetSnapshots = await this.budgetSnapshotEntityRepository.find({
      where: {
        id: In(createBudgetPlanDto.budgetSnapshotIds),
        createdBy: user.sub,
      },
    });

    if (budgetSnapshots.length !== createBudgetPlanDto.budgetSnapshotIds.length) {
      throw new NotFoundException('Budget snapshots are not found');
    }

    const plannedPaymentSnapshots = await this.plannedPaymentSnapshotEntityRepository.find({
      where: {
        id: In(createBudgetPlanDto.plannedPaymentSnapshotIds),
        createdBy: user.sub,
      },
    });

    if (plannedPaymentSnapshots.length !== createBudgetPlanDto.plannedPaymentSnapshotIds.length) {
      throw new NotFoundException('Planned payment snapshots are not found');
    }

    const newBudgetPlan = this.budgetPlanEntityRepository.create();

    newBudgetPlan.month = createBudgetPlanDto.month;
    newBudgetPlan.year = createBudgetPlanDto.year;
    newBudgetPlan.budgetSnapshots = budgetSnapshots;
    newBudgetPlan.plannedPaymentSnapshots = plannedPaymentSnapshots;
    newBudgetPlan.createdBy = user.sub;

    await this.budgetPlanEntityRepository.save(newBudgetPlan);

    return newBudgetPlan;
  }

  async findAll(params: PageOptionsDto, user: UserTokenParsedInterface): Promise<PageDto<BudgetPlanEntity>> {
    return paginate(this.budgetPlanEntityRepository, params, {
      where: {
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<BudgetPlanEntity> {
    try {
      const plannedPaymentEntity = await this.budgetPlanEntityRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
        },
        relations: {
          budgetSnapshots: true,
          plannedPaymentSnapshots: true,
        },
      });

      if (!plannedPaymentEntity) {
        throw new Error();
      }

      return plannedPaymentEntity;
    } catch {
      throw new NotFoundException();
    }
  }

  async remove(id: string, user: UserTokenParsedInterface): Promise<BudgetPlanEntity> {
    const targetCategory = await this.budgetPlanEntityRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    return this.budgetPlanEntityRepository.remove(targetCategory);
  }
}
