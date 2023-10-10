import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { CurrencyEnum, SettingsInterface } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.Settings)
export class SettingsEntity extends BaseEntity implements SettingsInterface {
  @Column({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  billingPeriodStartDayNumber: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @Column({ type: 'enum', enum: CurrencyEnum, enumName: 'currency_enum', default: CurrencyEnum.UAH })
  @IsNotEmpty()
  defaultCurrencyCode: CurrencyEnum;
}
