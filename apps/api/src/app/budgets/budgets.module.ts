import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { BudgetEntity } from './entities/budget.entity';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
  imports: [TypeOrmModule.forFeature([BudgetEntity])],
})
export class BudgetsModule {}
