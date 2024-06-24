import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { PeriodEnum, UserTokenParsedInterface } from '@financial-project/common';

import { CategoriesService } from '../categories/categories.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { PlannedPaymentEntity } from '../planned-payments/entities/planned-payment.entity';
import { CreatePlannedPaymentSnapshotDto } from './dto/create-planned-payment-snapshot.dto';
import { UpdatePlannedPaymentSnapshotDto } from './dto/update-planned-payment-snapshot.dto';
import { PlannedPaymentSnapshotEntity } from './entities/planned-payment-snapshot.entity';

@Injectable()
export class PlannedPaymentSnapshotsService {
  constructor(
    @InjectRepository(PlannedPaymentSnapshotEntity)
    private plannedPaymentSnapshotEntityRepository: Repository<PlannedPaymentSnapshotEntity>,
    @InjectRepository(PlannedPaymentEntity)
    private plannedPaymentEntityRepository: Repository<PlannedPaymentEntity>,
    private categoriesService: CategoriesService,
  ) {}

  async create(
    createPlannedPaymentSnapshotDto: CreatePlannedPaymentSnapshotDto,
    user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentSnapshotEntity> {
    const originalPlannedPayment = await this.plannedPaymentEntityRepository.findOne({
      where: {
        id: createPlannedPaymentSnapshotDto.id,
        createdBy: user.sub,
      },
      relations: { category: true },
    });

    if (!originalPlannedPayment) {
      throw new NotFoundException('Planned payment is not found');
    }

    const plannedPaymentSnapshotEntity = plainToInstance(PlannedPaymentSnapshotEntity, createPlannedPaymentSnapshotDto);
    plannedPaymentSnapshotEntity.createdBy = user.sub;

    let category: CategoryEntity;

    if (createPlannedPaymentSnapshotDto.categoryId) {
      try {
        category = await this.categoriesService.findOne(createPlannedPaymentSnapshotDto.categoryId, user);
      } catch {
        throw new BadRequestException('No such category');
      }

      if (category) {
        plannedPaymentSnapshotEntity.category = category;
      }
    }

    delete plannedPaymentSnapshotEntity.id;

    return this.plannedPaymentSnapshotEntityRepository.save({
      ...plannedPaymentSnapshotEntity,
      original: originalPlannedPayment,
    });
  }

  async findAll(
    params: PageOptionsDto,
    user: UserTokenParsedInterface,
  ): Promise<PageDto<PlannedPaymentSnapshotEntity>> {
    return paginate(this.plannedPaymentSnapshotEntityRepository, params, {
      where: {
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: { category: true },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<PlannedPaymentSnapshotEntity> {
    try {
      const plannedPaymentEntity = await this.plannedPaymentSnapshotEntityRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
        },
        relations: { category: true, original: true },
      });

      if (!plannedPaymentEntity) {
        throw new Error();
      }

      return plannedPaymentEntity;
    } catch {
      throw new NotFoundException();
    }
  }

  async update(
    id: string,
    updatePlannedPaymentSnapshotDto: UpdatePlannedPaymentSnapshotDto,
    user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentSnapshotEntity> {
    const targetPlannedPaymentEntity = await this.plannedPaymentSnapshotEntityRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetPlannedPaymentEntity) {
      throw new NotFoundException();
    }

    let category: CategoryEntity;

    if (updatePlannedPaymentSnapshotDto.categoryId) {
      try {
        category = await this.categoriesService.findOne(updatePlannedPaymentSnapshotDto.categoryId, user);
      } catch {
        throw new BadRequestException('No such category');
      }
    }

    const updatedPlannedPaymentEntity = plainToClassFromExist(
      targetPlannedPaymentEntity,
      updatePlannedPaymentSnapshotDto,
      {
        excludeExtraneousValues: true,
      },
    );

    updatedPlannedPaymentEntity.category = category;

    if (
      updatedPlannedPaymentEntity.period === PeriodEnum.OneTime ||
      updatedPlannedPaymentEntity.period === PeriodEnum.Yearly
    ) {
      updatedPlannedPaymentEntity.dateOfYear = updatePlannedPaymentSnapshotDto.dateOfYear!;
    } else if (updatedPlannedPaymentEntity.period === PeriodEnum.Monthly) {
      updatedPlannedPaymentEntity.dayOfMonth = updatePlannedPaymentSnapshotDto.dayOfMonth!;
    } else if (updatedPlannedPaymentEntity.period === PeriodEnum.Weekly) {
      updatedPlannedPaymentEntity.dayOfWeek = updatePlannedPaymentSnapshotDto.dayOfWeek!;
    }

    await this.plannedPaymentSnapshotEntityRepository.update(id, updatedPlannedPaymentEntity);

    return this.findOne(id, user);
  }

  async remove(id: string, user: UserTokenParsedInterface): Promise<PlannedPaymentSnapshotEntity> {
    const targetCategory = await this.plannedPaymentSnapshotEntityRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    return this.plannedPaymentSnapshotEntityRepository.remove(targetCategory);
  }
}
