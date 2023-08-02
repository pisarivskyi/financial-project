import { UUID } from '../types/uuid.type';
import { Exclude, Expose, Type } from 'class-transformer';

export class BaseModel {
  @Expose()
  @Exclude({ toPlainOnly: true })
  id!: UUID;

  @Expose({ name: 'created_at', toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Type(() => Date)
  createdAt!: Date;

  @Expose({ name: 'updated_at', toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Type(() => Date)
  updatedAt!: Date;
}
