import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { CurrentUser } from '../core/decorators/current-user.decorator';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetEntity } from './entities/budget.entity';

@Controller(ApiPathEnum.Budgets)
@ApiTags('budgets')
@ApiBearerAuth()
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Creates a new budget',
    type: BudgetEntity,
  })
  create(
    @Body() createBudgetDto: CreateBudgetDto,
    @CurrentUser() user: UserTokenParsedInterface,
  ): Promise<BudgetEntity> {
    return this.budgetsService.create(createBudgetDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Gets all budgets',
    type: BudgetEntity,
    isArray: true,
  })
  findAll(
    @Query() params: PageOptionsDto,
    @CurrentUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<BudgetEntity>> {
    return this.budgetsService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Gets a single budget by id',
    type: BudgetEntity,
  })
  findOne(@Param('id') id: string, @CurrentUser() user: UserTokenParsedInterface): Promise<BudgetEntity> {
    return this.budgetsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Updates a single budget by id',
    type: BudgetEntity,
  })
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @CurrentUser() user: UserTokenParsedInterface,
  ): Promise<BudgetEntity> {
    return this.budgetsService.update(id, updateBudgetDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Removes a single budget by id',
    type: BudgetEntity,
  })
  remove(@Param('id') id: string, @CurrentUser() user: UserTokenParsedInterface): Promise<BudgetEntity> {
    return this.budgetsService.remove(id, user);
  }
}
