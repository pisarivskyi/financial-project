import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

import { UserTokenParsedInterface } from '@financial-project/common';

import { CategoriesService } from '../categories/categories.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { CreatePlannedPaymentDto } from './dto/create-planned-payment.dto';
import { UpdatePlannedPaymentDto } from './dto/update-planned-payment.dto';
import { PlannedPaymentEntity } from './entities/planned-payment.entity';

@Injectable()
export class PlannedPaymentsService {
  constructor(
    @InjectRepository(PlannedPaymentEntity) private plannedPaymentEntityRepository: Repository<PlannedPaymentEntity>,
    private categoriesService: CategoriesService,
  ) {}

  async create(
    createCategoryDto: CreatePlannedPaymentDto,
    user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentEntity> {
    const plannedPaymentEntity = plainToInstance(PlannedPaymentEntity, createCategoryDto);
    plannedPaymentEntity.createdBy = user.sub;

    let category: CategoryEntity;

    if (createCategoryDto.category) {
      try {
        category = await this.categoriesService.findOne(createCategoryDto.category, user);
      } catch {
        throw new BadRequestException('No such category');
      }

      if (category) {
        plannedPaymentEntity.category = category;
      }
    }

    return this.plannedPaymentEntityRepository.save(plannedPaymentEntity);
  }

  async findAll(params: PageOptionsDto, user: UserTokenParsedInterface): Promise<PageDto<PlannedPaymentEntity>> {
    return paginate(this.plannedPaymentEntityRepository, params, {
      where: {
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: { category: true },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<PlannedPaymentEntity> {
    try {
      const plannedPaymentEntity = await this.plannedPaymentEntityRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
        },
        relations: { category: true },
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
    updatePlannedPaymentDto: UpdatePlannedPaymentDto,
    user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentEntity> {
    const targetPlannedPaymentEntity = await this.plannedPaymentEntityRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetPlannedPaymentEntity) {
      throw new NotFoundException();
    }

    if (updatePlannedPaymentDto.category) {
      const parentCategory = await this.plannedPaymentEntityRepository.findOne({
        where: {
          id: updatePlannedPaymentDto.category,
          createdBy: In([user.sub, 'SYSTEM']),
        },
      });

      if (!parentCategory) {
        throw new NotFoundException('Category does not exist');
      }
    }

    const updatedPlannedPaymentEntity = plainToClassFromExist(targetPlannedPaymentEntity, updatePlannedPaymentDto);

    await this.plannedPaymentEntityRepository.update(id, updatedPlannedPaymentEntity);

    return this.findOne(id, user);
  }

  async remove(id: string, user: UserTokenParsedInterface): Promise<PlannedPaymentEntity> {
    const targetCategory = await this.plannedPaymentEntityRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetCategory) {
      throw new NotFoundException();
    }

    return this.plannedPaymentEntityRepository.remove(targetCategory);
  }
}
