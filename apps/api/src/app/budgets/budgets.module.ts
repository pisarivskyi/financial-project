import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { CategoriesModule } from '../categories/categories.module';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { BudgetEntity } from './entities/budget.entity';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
  imports: [TypeOrmModule.forFeature([BudgetEntity]), CategoriesModule, AuthenticationModule],
})
export class BudgetsModule {}
