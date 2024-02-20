import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { CreatePlannedPaymentDto } from './dto/create-planned-payment.dto';
import { UpdatePlannedPaymentDto } from './dto/update-planned-payment.dto';
import { PlannedPaymentEntity } from './entities/planned-payment.entity';
import { PlannedPaymentsService } from './planned-payments.service';

@Controller(ApiPathEnum.PlannedPayments)
@ApiTags('planned-payments')
@ApiBearerAuth()
export class PlannedPaymentsController {
  constructor(private readonly plannedPaymentsService: PlannedPaymentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createPlannedPaymentDto: CreatePlannedPaymentDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentEntity> {
    return this.plannedPaymentsService.create(createPlannedPaymentDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<PlannedPaymentEntity>> {
    return this.plannedPaymentsService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<PlannedPaymentEntity> {
    return this.plannedPaymentsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePlannedPaymentDto: UpdatePlannedPaymentDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentEntity> {
    return this.plannedPaymentsService.update(id, updatePlannedPaymentDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<PlannedPaymentEntity> {
    return this.plannedPaymentsService.remove(id, user);
  }
}
