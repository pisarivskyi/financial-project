import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { CategoriesModule } from '../categories/categories.module';
import { PlannedPaymentEntity } from '../planned-payments/entities/planned-payment.entity';
import { PlannedPaymentSnapshotEntity } from './entities/planned-payment-snapshot.entity';
import { PlannedPaymentSnapshotsController } from './planned-payment-snapshots.controller';
import { PlannedPaymentSnapshotsService } from './planned-payment-snapshots.service';

@Module({
  controllers: [PlannedPaymentSnapshotsController],
  providers: [PlannedPaymentSnapshotsService],
  imports: [
    TypeOrmModule.forFeature([PlannedPaymentSnapshotEntity, PlannedPaymentEntity]),
    CategoriesModule,
    AuthenticationModule,
  ],
  exports: [PlannedPaymentSnapshotsService],
})
export class PlannedPaymentSnapshotsModule {}
