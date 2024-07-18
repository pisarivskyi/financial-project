import { Exclude, Expose, Type } from 'class-transformer';

export class BaseModel {
  @Expose()
  @Exclude({ toPlainOnly: true })
  id!: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Exclude({ toPlainOnly: true })
  @Type(() => Date)
  updatedAt!: Date;
}
