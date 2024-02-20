import { PartialType } from '@nestjs/swagger';

import { CreatePlannedPaymentDto } from './create-planned-payment.dto';

export class UpdatePlannedPaymentDto extends PartialType(CreatePlannedPaymentDto) {}
