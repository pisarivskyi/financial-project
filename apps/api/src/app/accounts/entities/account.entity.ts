import { Entity } from 'typeorm';

import { BaseEntity } from '../../core/models/base-entity.abstract';

@Entity()
export class AccountEntity extends BaseEntity {}
