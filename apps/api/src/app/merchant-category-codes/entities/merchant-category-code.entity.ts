import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { MerchantCategoryCodeInterface } from '@financial-project/common';

import { CategoryEntity } from '../../categories/entities/category.entity';
import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.MerchantCategoryCodes)
export class MerchantCategoryCodeEntity extends BaseEntity implements MerchantCategoryCodeInterface {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  code: number;

  @Column({ default: 'SYSTEM' })
  @ApiProperty()
  createdBy: string;

  @ManyToMany(() => CategoryEntity, (category) => category.merchantCategoryCodes, { onDelete: 'SET NULL' })
  @JoinTable()
  @Expose()
  @ApiProperty({ isArray: true, type: CategoryEntity })
  categories: CategoryEntity[];
}
