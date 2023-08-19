import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity } from 'typeorm';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { getArgon2Hash } from '../../shared/utils/hash-helpers';

@Entity(TableNameEnum.Users)
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ unique: true })
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await getArgon2Hash(this.password);
  }
}
