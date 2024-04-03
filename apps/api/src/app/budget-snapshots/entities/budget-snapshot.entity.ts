import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BudgetEntity } from '../../budgets/entities/budget.entity';
import { TableNameEnum } from '../../core/enums/table-name.enum';

@Entity(TableNameEnum.BudgetSnapshots)
export class BudgetSnapshotEntity extends BudgetEntity {
  @ManyToOne(() => BudgetEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @IsOptional()
  @ApiPropertyOptional({ type: () => BudgetEntity })
  original: BudgetEntity;
}
