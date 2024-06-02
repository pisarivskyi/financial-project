import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { PlannedPaymentSnapshotInterface } from '@financial-project/common';

import { BudgetPlanEntity } from '../../budget-plans/entities/budget-plan.entity';
import { TableNameEnum } from '../../core/enums/table-name.enum';
import { PlannedPaymentEntity } from '../../planned-payments/entities/planned-payment.entity';

@Entity(TableNameEnum.PlannedPaymentSnapshots)
export class PlannedPaymentSnapshotEntity extends PlannedPaymentEntity implements PlannedPaymentSnapshotInterface {
  @ManyToOne(() => PlannedPaymentEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @IsOptional()
  @ApiPropertyOptional({ type: () => PlannedPaymentEntity })
  original: PlannedPaymentEntity;

  @ManyToOne(() => BudgetPlanEntity, (budgetPlan) => budgetPlan.plannedPaymentSnapshots, { onDelete: 'CASCADE' })
  budgetPlan: BudgetPlanEntity;
}
