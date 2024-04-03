import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { PlannedPaymentEntity } from '../planned-payments/entities/planned-payment.entity';
import { CreatePlannedPaymentSnapshotDto } from './dto/create-planned-payment-snapshot.dto';
import { PlannedPaymentSnapshotEntity } from './entities/planned-payment-snapshot.entity';

@Injectable()
export class PlannedPaymentSnapshotsService {
  constructor(
    @InjectRepository(PlannedPaymentSnapshotEntity)
    private plannedPaymentSnapshotEntityRepository: Repository<PlannedPaymentSnapshotEntity>,
    @InjectRepository(PlannedPaymentEntity) private plannedPaymentEntityRepository: Repository<PlannedPaymentEntity>,
  ) {}

  async create(
    createCategoryDto: CreatePlannedPaymentSnapshotDto,
    user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentSnapshotEntity> {
    const originalPlannedPayment = await this.plannedPaymentEntityRepository.findOne({
      where: {
        id: createCategoryDto.originalId,
        createdBy: user.sub,
      },
      relations: { category: true },
    });

    if (!originalPlannedPayment) {
      throw new NotFoundException('Planned payment is not found');
    }

    const cloneData = instanceToPlain(originalPlannedPayment);

    delete cloneData.id;

    return this.plannedPaymentSnapshotEntityRepository.save({
      ...cloneData,
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
