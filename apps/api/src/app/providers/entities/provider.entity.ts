import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ProviderDataType, ProviderInterface, ProviderTypeEnum } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { UserEntity } from '../../users/entities/user.entity';
import { IsNotEmpty, IsObject } from 'class-validator';

@Entity(TableNameEnum.Providers)
export class ProviderEntity extends BaseEntity implements ProviderInterface {
  @Column({ type: 'enum', enum: ProviderTypeEnum })
  providerType: ProviderTypeEnum;

  @Column({ type: 'json' })
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @IsObject()
  data: ProviderDataType;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  @ApiProperty()
  createdBy: UserEntity;
}
