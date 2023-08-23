import { Trim } from 'class-sanitizer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CategoryInterface } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.Categories)
export class CategoryEntity extends BaseEntity implements CategoryInterface {
  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @Trim()
  @IsString()
  @IsNotEmpty()
  color: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  icon: string;

  @Column()
  createdBy: string;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber()
  mccRangeStart?: number;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber()
  mccRangeEnd?: number;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn()
  @IsOptional()
  parentCategory?: CategoryEntity;
}
