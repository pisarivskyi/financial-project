import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CurrencyEnum, PeriodEnum, PlannedPaymentInterface, RecordTypeEnum } from '@financial-project/common';

import { CategoryEntity } from '../../categories/entities/category.entity';
import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.PlannedPayments)
export class PlannedPaymentEntity extends BaseEntity implements PlannedPaymentInterface {
  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  color?: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  icon?: string;

  @ManyToOne(() => CategoryEntity, { onDelete: 'SET NULL' })
  @JoinColumn()
  @IsNotEmpty()
  @ApiProperty({ type: () => CategoryEntity })
  category: CategoryEntity;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @Column({ type: 'enum', enum: CurrencyEnum, enumName: 'currency_enum' })
  @IsNotEmpty()
  @ApiProperty({ enum: CurrencyEnum, enumName: 'CurrencyEnum' })
  currencyCode: CurrencyEnum;

  @Column({ type: 'enum', enum: RecordTypeEnum, enumName: 'record_type_enum' })
  @IsNotEmpty()
  @ApiProperty({ enum: RecordTypeEnum, enumName: 'RecordTypeEnum' })
  type: RecordTypeEnum;

  @Column({ type: 'enum', enum: PeriodEnum, enumName: 'period_enum' })
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ enum: PeriodEnum, enumName: 'PeriodEnum' })
  period: PeriodEnum;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @ApiPropertyOptional()
  dayOfWeek?: number;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @ApiPropertyOptional()
  dayOfMonth?: number;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  @Type(() => Date)
  dateOfYear?: Date;

  @Column()
  @ApiProperty()
  createdBy: string;
}
