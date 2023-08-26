import { OmitType } from '@nestjs/swagger';

import { AccountEntity } from '../entities/account.entity';

export class CreateAccountDto extends OmitType(AccountEntity, ['id', 'createdAt', 'updatedAt', 'createdBy']) {}
