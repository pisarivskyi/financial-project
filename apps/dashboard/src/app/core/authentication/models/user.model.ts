import { Expose } from 'class-transformer';

import { BaseModel } from '../../supabase/models/base.model';

export class UserModel extends BaseModel {
  @Expose()
  email: string | undefined;

  @Expose()
  role: string | undefined;
}
