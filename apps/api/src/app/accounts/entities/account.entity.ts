import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AccountInterface, AccountTypeEnum, CurrencyEnum, ProviderTypeEnum } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { ProviderEntity } from '../../providers/entities/provider.entity';

@Entity(TableNameEnum.Accounts)
export class AccountEntity extends BaseEntity implements AccountInterface {
  @Column({ unique: true, nullable: true })
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  bankAccountId?: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    enumName: 'account_type_enum'
  })
  @IsNotEmpty()
  @ApiProperty({ enum: AccountTypeEnum, enumName: 'AccountType' })
  type: AccountTypeEnum;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  balance: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  bankSpecificType?: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  color?: string;

  @Column({
    type: 'enum',
    enum: CurrencyEnum,
    enumName: 'currency_enum',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: CurrencyEnum, enumName: 'CurrencyEnum' })
  currencyCode: CurrencyEnum;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  metadata?: object;

  @ManyToOne(() => ProviderEntity, { nullable: true })
  @JoinColumn()
  @ApiProperty()
  provider?: ProviderEntity;

  @Column({
    type: 'enum',
    enum: ProviderTypeEnum,
    enumName: 'provider_type_enum'
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ProviderTypeEnum, enumName: 'ProviderTypeEnum' })
  providerType: ProviderTypeEnum;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty()
  maskedPan?: string;

  @Column()
  @ApiProperty()
  createdBy: string;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  lastSyncDate?: Date;
}
