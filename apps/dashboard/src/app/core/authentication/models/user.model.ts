import { User } from '@supabase/supabase-js';

import { BaseModel } from '../../supabase/models/base.model';

export class UserModel extends BaseModel {
  email: string | undefined;
  role: string | undefined;

  constructor(data: User) {
    super();

    super.toModel(data);
    this.toModel(data);
  }

  override toModel(data: User): void {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
  }
}
