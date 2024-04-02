import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { CategoriesModule } from '../categories/categories.module';
import { PlannedPaymentEntity } from './entities/planned-payment.entity';
import { PlannedPaymentsController } from './planned-payments.controller';
import { PlannedPaymentsService } from './planned-payments.service';

@Module({
  controllers: [PlannedPaymentsController],
  providers: [PlannedPaymentsService],
  imports: [TypeOrmModule.forFeature([PlannedPaymentEntity]), CategoriesModule, AuthenticationModule],
  exports: [PlannedPaymentsService],
})
export class PlannedPaymentsModule {}
