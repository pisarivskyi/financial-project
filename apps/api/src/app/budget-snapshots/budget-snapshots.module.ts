import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { BudgetEntity } from '../budgets/entities/budget.entity';
import { CategoriesModule } from '../categories/categories.module';
import { BudgetSnapshotsController } from './budget-snapshots.controller';
import { BudgetSnapshotsService } from './budget-snapshots.service';
import { BudgetSnapshotEntity } from './entities/budget-snapshot.entity';

@Module({
  controllers: [BudgetSnapshotsController],
  providers: [BudgetSnapshotsService],
  imports: [TypeOrmModule.forFeature([BudgetSnapshotEntity, BudgetEntity]), CategoriesModule, AuthenticationModule],
  exports: [BudgetSnapshotsService],
})
export class BudgetSnapshotsModule {}
