import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserInterface } from '@financial-project/common';

import { CategoriesService } from '../categories/categories.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordEntity } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    private categoriesService: CategoriesService
  ) {}

  findAll(user: UserInterface): Promise<RecordEntity[]> {
    return this.recordsRepository.find({
      where: {
        createdBy: user.sub,
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
          createdBy: user.sub,
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
        createdBy: user.sub,
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

    targetRecord.comment = updateRecordDto.comment ?? targetRecord.comment;

    await this.recordsRepository.save(targetRecord);

    return this.findOne(id, user);
  }
}
