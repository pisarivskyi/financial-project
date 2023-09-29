import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  mccRangeStart?: number;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  mccRangeEnd?: number;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @IsOptional()
  @ApiPropertyOptional({ type: () => CategoryEntity })
  parentCategory?: CategoryEntity;
}
