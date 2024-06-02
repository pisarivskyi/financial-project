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
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  color?: string;

  @Column({ nullable: true })
  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  icon?: string;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @Expose()
  @JoinColumn()
  @IsNotEmpty()
  @ApiProperty({ type: () => CategoryEntity })
  category: CategoryEntity;

  @Column()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @Column({ type: 'enum', enum: CurrencyEnum, enumName: 'currency_enum' })
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ enum: CurrencyEnum, enumName: 'CurrencyEnum' })
  currencyCode: CurrencyEnum;

  @Column({ type: 'enum', enum: RecordTypeEnum, enumName: 'record_type_enum' })
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ enum: RecordTypeEnum, enumName: 'RecordTypeEnum' })
  type: RecordTypeEnum;

  @Column({ type: 'enum', enum: PeriodEnum, enumName: 'period_enum' })
  @Expose()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ enum: PeriodEnum, enumName: 'PeriodEnum' })
  period: PeriodEnum;

  @Column({
    nullable: true,
  })
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  dayOfWeek?: number;

  @Column({
    nullable: true,
  })
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  dayOfMonth?: number;

  @Column({
    nullable: true,
  })
  @Expose()
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  @Type(() => Date)
  dateOfYear?: Date;

  @Column()
  @ApiProperty()
  createdBy: string;
}
