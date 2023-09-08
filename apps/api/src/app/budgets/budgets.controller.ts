import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
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
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Creates a new budget',
    type: BudgetEntity,
  })
  create(@Body() createBudgetDto: CreateBudgetDto, @CurrentUser() user: UserInterface): Promise<BudgetEntity> {
    return this.budgetsService.create(createBudgetDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Gets all budgets',
    type: BudgetEntity,
    isArray: true,
  })
  findAll(@CurrentUser() user: UserInterface): Promise<BudgetEntity[]> {
    return this.budgetsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Gets a single budget by id',
    type: BudgetEntity,
  })
  findOne(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<BudgetEntity> {
    return this.budgetsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Updates a single budget by id',
    type: BudgetEntity,
  })
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @CurrentUser() user: UserInterface
  ): Promise<BudgetEntity> {
    return this.budgetsService.update(id, updateBudgetDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Removes a single budget by id',
    type: BudgetEntity,
  })
  remove(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<BudgetEntity> {
    return this.budgetsService.remove(id, user);
  }
}
