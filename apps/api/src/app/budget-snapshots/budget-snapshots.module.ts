import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { BudgetEntity } from '../budgets/entities/budget.entity';
import { BudgetSnapshotsController } from './budget-snapshots.controller';
import { BudgetSnapshotsService } from './budget-snapshots.service';
import { BudgetSnapshotEntity } from './entities/budget-snapshot.entity';

@Module({
  controllers: [BudgetSnapshotsController],
  providers: [BudgetSnapshotsService],
  imports: [TypeOrmModule.forFeature([BudgetSnapshotEntity, BudgetEntity]), AuthenticationModule],
  exports: [BudgetSnapshotsService],
})
export class BudgetSnapshotsModule {}
