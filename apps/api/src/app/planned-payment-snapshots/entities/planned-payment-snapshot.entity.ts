import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from '../../core/enums/table-name.enum';
import { PlannedPaymentEntity } from '../../planned-payments/entities/planned-payment.entity';

@Entity(TableNameEnum.PlannedPaymentSnapshots)
export class PlannedPaymentSnapshotEntity extends PlannedPaymentEntity {
  @ManyToOne(() => PlannedPaymentEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @IsOptional()
  @ApiPropertyOptional({ type: () => PlannedPaymentEntity })
  original: PlannedPaymentEntity;
}
