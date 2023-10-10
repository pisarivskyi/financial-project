import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonobankModule } from '@financial-project/providers';

import { CategoriesModule } from '../categories/categories.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountEntity } from './entities/account.entity';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [TypeOrmModule.forFeature([AccountEntity]), MonobankModule, CategoriesModule],
  exports: [AccountsService],
})
export class AccountsModule {}
