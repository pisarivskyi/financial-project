import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from 'class-sanitizer';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { CategoryInterface } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { MerchantCategoryCodeEntity } from '../../merchant-category-codes/entities/merchant-category-code.entity';

@Entity(TableNameEnum.Categories)
export class CategoryEntity extends BaseEntity implements CategoryInterface {
  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @Column()
  @Trim()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  color: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  icon: string;

  @Column()
  @ApiProperty()
  createdBy: string;

  @ManyToMany(() => MerchantCategoryCodeEntity, { onDelete: 'SET NULL' })
  @Expose()
  @ApiProperty({ isArray: true, type: MerchantCategoryCodeEntity })
  merchantCategoryCodes: MerchantCategoryCodeEntity[];

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @IsOptional()
  @ApiPropertyOptional({ type: () => CategoryEntity })
  parentCategory?: CategoryEntity;
}
