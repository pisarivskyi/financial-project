import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AccountInterface, AccountType, CurrencyEnum, ProviderEnum } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { UserEntity } from '../../users/entities/user.entity';

@Entity(TableNameEnum.Accounts)
export class AccountEntity extends BaseEntity implements AccountInterface {
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
  @IsJSON()
  @ApiPropertyOptional()
  metadata?: JSON;

  @Column({
    type: 'enum',
    enum: ProviderEnum,
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ProviderEnum, enumName: 'ProviderEnum' })
  provider: ProviderEnum;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  @ApiProperty()
  createdBy: UserEntity;
}
