import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from 'class-sanitizer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CategoryInterface } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { UserEntity } from '../../users/entities/user.entity';

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

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  createdBy: UserEntity;

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

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn()
  @IsOptional()
  @ApiPropertyOptional({ type: () => CategoryEntity })
  parentCategory?: CategoryEntity;
}
