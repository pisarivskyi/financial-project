import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { CreatePlannedPaymentSnapshotDto } from './dto/create-planned-payment-snapshot.dto';
import { UpdatePlannedPaymentSnapshotDto } from './dto/update-planned-payment-snapshot.dto';
import { PlannedPaymentSnapshotEntity } from './entities/planned-payment-snapshot.entity';
import { PlannedPaymentSnapshotsService } from './planned-payment-snapshots.service';

@Controller(ApiPathEnum.PlannedPaymentSnapshots)
@ApiTags('planned-payment-snapshots')
@ApiBearerAuth()
export class PlannedPaymentSnapshotsController {
  constructor(private readonly plannedPaymentSnapshotsService: PlannedPaymentSnapshotsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createPlannedPaymentDto: CreatePlannedPaymentSnapshotDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentSnapshotEntity> {
    return this.plannedPaymentSnapshotsService.create(createPlannedPaymentDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<PlannedPaymentSnapshotEntity>> {
    return this.plannedPaymentSnapshotsService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Param('id') id: string,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentSnapshotEntity> {
    return this.plannedPaymentSnapshotsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePlannedPaymentSnapshotDto: UpdatePlannedPaymentSnapshotDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentSnapshotEntity> {
    return this.plannedPaymentSnapshotsService.update(id, updatePlannedPaymentSnapshotDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(
    @Param('id') id: string,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PlannedPaymentSnapshotEntity> {
    return this.plannedPaymentSnapshotsService.remove(id, user);
  }
}
