import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { BudgetSnapshotsService } from './budget-snapshots.service';
import { CreateBudgetSnapshotDto } from './dto/create-budget-snapshot.dto';
import { UpdateBudgetSnapshotDto } from './dto/update-budget-snapshot.dto';
import { BudgetSnapshotEntity } from './entities/budget-snapshot.entity';

@Controller(ApiPathEnum.BudgetSnapshots)
@ApiTags('budget-snapshots')
@ApiBearerAuth()
export class BudgetSnapshotsController {
  constructor(private readonly budgetSnapshotsService: BudgetSnapshotsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createPlannedPaymentDto: CreateBudgetSnapshotDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<BudgetSnapshotEntity> {
    return this.budgetSnapshotsService.create(createPlannedPaymentDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<BudgetSnapshotEntity>> {
    return this.budgetSnapshotsService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<BudgetSnapshotEntity> {
    return this.budgetSnapshotsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Updates a single budget snapshot by id',
    type: BudgetSnapshotEntity,
  })
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetSnapshotDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<BudgetSnapshotEntity> {
    return this.budgetSnapshotsService.update(id, updateBudgetDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<BudgetSnapshotEntity> {
    return this.budgetSnapshotsService.remove(id, user);
  }
}
