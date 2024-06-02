import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { BudgetSnapshotEntity } from '../budget-snapshots/entities/budget-snapshot.entity';
import { CategoriesModule } from '../categories/categories.module';
import { PlannedPaymentSnapshotEntity } from '../planned-payment-snapshots/entities/planned-payment-snapshot.entity';
import { BudgetPlansController } from './budget-plans.controller';
import { BudgetPlansService } from './budget-plans.service';
import { BudgetPlanEntity } from './entities/budget-plan.entity';

@Module({
  controllers: [BudgetPlansController],
  providers: [BudgetPlansService],
  imports: [
    TypeOrmModule.forFeature([BudgetPlanEntity, PlannedPaymentSnapshotEntity, BudgetSnapshotEntity]),
    CategoriesModule,
    AuthenticationModule,
  ],
  exports: [BudgetPlansService],
})
export class BudgetPlansModule {}
