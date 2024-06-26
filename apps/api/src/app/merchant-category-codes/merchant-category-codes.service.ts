import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { MerchantCategoryCodeEntity } from './entities/merchant-category-code.entity';

@Injectable()
export class MerchantCategoryCodesService {
  constructor(
    @InjectRepository(MerchantCategoryCodeEntity)
    private merchantCategoryCodeRepository: Repository<MerchantCategoryCodeEntity>,
  ) {}

  async findAll(params: PageOptionsDto, user: UserTokenParsedInterface): Promise<PageDto<MerchantCategoryCodeEntity>> {
    return paginate(this.merchantCategoryCodeRepository, params, {
      where: {
        createdBy: In([user.sub, 'SYSTEM']),
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        categories: true,
      },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<MerchantCategoryCodeEntity> {
    try {
      const category = await this.merchantCategoryCodeRepository.findOne({
        where: {
          id,
          createdBy: In([user.sub, 'SYSTEM']),
        },
      });

      if (!category) {
        throw new Error();
      }

      return category;
    } catch {
      throw new NotFoundException();
    }
  }
}
