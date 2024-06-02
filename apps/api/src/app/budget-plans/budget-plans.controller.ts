import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { BudgetPlansService } from './budget-plans.service';
import { CreateBudgetPlanDto } from './dto/create-budget-plan.dto';
import { BudgetPlanEntity } from './entities/budget-plan.entity';

@Controller(ApiPathEnum.BudgetPlans)
@ApiTags('budget-plans')
@ApiBearerAuth()
export class BudgetPlansController {
  constructor(private readonly budgetPlansService: BudgetPlansService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createBudgetPlanDto: CreateBudgetPlanDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<BudgetPlanEntity> {
    return this.budgetPlansService.create(createBudgetPlanDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<BudgetPlanEntity>> {
    return this.budgetPlansService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<BudgetPlanEntity> {
    return this.budgetPlansService.findOne(id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<BudgetPlanEntity> {
    return this.budgetPlansService.remove(id, user);
  }
}
