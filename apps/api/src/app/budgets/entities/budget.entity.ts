import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BudgetInterface, CurrencyEnum, PeriodEnum } from '@financial-project/common';

import { CategoryEntity } from '../../categories/entities/category.entity';
import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.Budgets)
export class BudgetEntity extends BaseEntity implements BudgetInterface {
  @Column()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @Column()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  amount: number;

  @Column({ type: 'enum', enum: CurrencyEnum, enumName: 'currency_enum' })
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ enum: CurrencyEnum, enumName: 'CurrencyEnum' })
  currencyCode: CurrencyEnum;

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  @Expose()
  @ApiProperty({ isArray: true, type: CategoryEntity })
  categories: CategoryEntity[];

  @Column({ nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  color?: string;

  @Column({ type: 'enum', enum: PeriodEnum, enumName: 'period_enum' })
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ enum: PeriodEnum, enumName: 'PeriodEnum' })
  period: PeriodEnum;

  @Column({ nullable: true })
  @Expose()
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  fromDate?: Date;

  @Column({ nullable: true })
  @Expose()
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  toDate?: Date;

  @Column()
  @ApiProperty()
  createdBy: string;
}
