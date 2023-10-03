import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CurrencyEnum, RecordCreationTypeEnum, RecordInterface, RecordTypeEnum } from '@financial-project/common';

import { AccountEntity } from '../../accounts/entities/account.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.Records)
export class RecordEntity extends BaseEntity implements RecordInterface {
  @Column({ unique: true, nullable: true })
  bankRecordId?: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  operationAmount: number;

  @Column({ type: 'enum', enum: RecordTypeEnum, enumName: 'record_type_enum' })
  type: RecordTypeEnum;

  @Column()
  balance: number;

  @Column({ default: '' })
  comment: string;

  @Column({ type: 'enum', enum: RecordCreationTypeEnum, enumName: 'record_creation_type_enum' })
  creationType: RecordCreationTypeEnum;

  @Column({ type: 'enum', enum: CurrencyEnum, enumName: 'currency_enum' })
  currencyCode: CurrencyEnum;

  @Column({ type: 'enum', enum: CurrencyEnum, enumName: 'currency_enum', nullable: true })
  operationCurrencyCode: CurrencyEnum;

  @Column({ default: '' })
  description: string;

  @Column()
  mcc: number;

  @Column({ nullable: true })
  bankCreatedAt: Date;

  @Column({ type: 'json', nullable: true })
  @Exclude({ toPlainOnly: true })
  metadata?: object;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: AccountEntity;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  category?: CategoryEntity;

  @Column()
  @ApiProperty()
  createdBy: string;
}
