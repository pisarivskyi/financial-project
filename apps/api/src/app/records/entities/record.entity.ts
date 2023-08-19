import { Entity } from 'typeorm';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity(TableNameEnum.Records)
export class RecordEntity extends BaseEntity {}