import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ProviderDataType, ProviderInterface, ProviderTypeEnum } from '@financial-project/common';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.Providers)
export class ProviderEntity extends BaseEntity implements ProviderInterface {
  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ type: 'enum', enum: ProviderTypeEnum, enumName: 'provider_type_enum' })
  providerType: ProviderTypeEnum;

  @Column({ type: 'json' })
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @IsObject()
  data: ProviderDataType;

  @Column()
  @ApiProperty()
  createdBy: string;
}
