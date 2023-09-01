import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AccountInterface, AccountType, CurrencyEnum, ProviderTypeEnum } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { ProviderEntity } from '../../providers/entities/provider.entity';
import { UserEntity } from '../../users/entities/user.entity';

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
    enum: AccountType,
  })
  @IsNotEmpty()
  @ApiProperty({ enum: AccountType, enumName: 'AccountType' })
  type: AccountType;

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
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ProviderTypeEnum, enumName: 'ProviderTypeEnum' })
  providerType: ProviderTypeEnum;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty()
  maskedPan?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  @ApiProperty()
  createdBy: UserEntity;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  lastSyncDate?: Date;
}
