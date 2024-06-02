import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { BudgetPlanInterface } from '@financial-project/common';

import { BudgetSnapshotEntity } from '../../budget-snapshots/entities/budget-snapshot.entity';
import { TableNameEnum } from '../../core/enums/table-name.enum';
import { BaseEntity } from '../../core/models/base-entity.abstract';
import { PlannedPaymentSnapshotEntity } from '../../planned-payment-snapshots/entities/planned-payment-snapshot.entity';

@Entity(TableNameEnum.BudgetPlans)
export class BudgetPlanEntity extends BaseEntity implements BudgetPlanInterface {
  @Column()
  month: number;

  @Column()
  year: number;

  @OneToMany(() => PlannedPaymentSnapshotEntity, (plannedPaymentSnapshot) => plannedPaymentSnapshot.budgetPlan, {
    onDelete: 'CASCADE',
  })
  @ApiPropertyOptional({ type: () => PlannedPaymentSnapshotEntity })
  plannedPaymentSnapshots: PlannedPaymentSnapshotEntity[];

  @OneToMany(() => BudgetSnapshotEntity, (budgetSnapshot) => budgetSnapshot.budgetPlan, { onDelete: 'CASCADE' })
  @ApiPropertyOptional({ type: () => BudgetSnapshotEntity })
  budgetSnapshots: BudgetSnapshotEntity[];

  @Column()
  @ApiProperty()
  createdBy: string;
}
