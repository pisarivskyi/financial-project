import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoriesService } from '../categories/categories.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordEntity } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    private categoriesService: CategoriesService
  ) {}

  findAll(user: UserEntity): Promise<RecordEntity[]> {
    return this.recordsRepository.find({
      where: {
        createdBy: {
          id: user.id,
        },
      },
      order: {
        bankCreatedAt: 'DESC',
      },
    });
  }

  async findOne(id: string, user: UserEntity): Promise<RecordEntity> {
    try {
      const record = await this.recordsRepository.findOne({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
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

  async update(id: string, updateRecordDto: UpdateRecordDto, user: UserEntity): Promise<RecordEntity> {
    const targetRecord = await this.recordsRepository.findOne({
      where: {
        id,
        createdBy: {
          id: user.id,
        },
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
