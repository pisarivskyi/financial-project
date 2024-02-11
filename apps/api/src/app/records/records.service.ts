import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserInterface } from '@financial-project/common';

import { CategoriesService } from '../categories/categories.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordEntity } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    private categoriesService: CategoriesService,
  ) {}

  findAll(params: PageOptionsDto, user: UserInterface): Promise<PageDto<RecordEntity>> {
    return paginate(this.recordsRepository, params, {
      where: {
        createdBy: user.id,
      },
      relations: {
        account: true,
        category: true,
      },
      order: {
        bankCreatedAt: 'DESC',
      },
    });
  }

  async findOne(id: string, user: UserInterface): Promise<RecordEntity> {
    try {
      const record = await this.recordsRepository.findOne({
        where: {
          id,
          createdBy: user.id,
        },
        relations: {
          account: true,
          category: true,
        },
      });

      if (!record) {
        throw new Error();
      }

      return record;
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, updateRecordDto: UpdateRecordDto, user: UserInterface): Promise<RecordEntity> {
    const targetRecord = await this.recordsRepository.findOne({
      where: {
        id,
        createdBy: user.id,
      },
    });

    if (!targetRecord) {
      throw new NotFoundException();
    }

    if (updateRecordDto.categoryId) {
      const category: CategoryEntity = await this.categoriesService.findOne(updateRecordDto.categoryId, user);

      if (!category) {
        throw new NotFoundException();
      }

      targetRecord.category = category;
    }

    targetRecord.name = updateRecordDto.name ?? targetRecord.name;
    targetRecord.comment = updateRecordDto.comment ?? targetRecord.comment;

    await this.recordsRepository.save(targetRecord);

    return this.findOne(id, user);
  }
}
