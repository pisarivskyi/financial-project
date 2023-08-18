import * as argon2d from 'argon2';
import { BeforeInsert, Column, Entity } from 'typeorm';

import { BaseEntity } from '../../core/models/base-entity.abstract';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ unique: true })
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await argon2d.hash(this.password);
  }
}
