import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Job } from 'bull';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';
import { AccountJobPayloadInterface } from './interfaces/account-job-payload.interface';
import { AccountsService } from './services/accounts.service';

@Controller(ApiPathEnum.Accounts)
@ApiTags('accounts')
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAccountDto: CreateAccountDto, @CurrentUser() user: UserInterface): Promise<AccountEntity> {
    return this.accountsService.create(createAccountDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() params: PageOptionsDto, @CurrentUser() user: UserInterface): Promise<PageDto<AccountEntity>> {
    return this.accountsService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<AccountEntity> {
    return this.accountsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @CurrentUser() user: UserInterface
  ): Promise<AccountEntity> {
    return this.accountsService.update(id, updateAccountDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<AccountEntity> {
    return this.accountsService.remove(id, user);
  }

  @Get(':id/sync')
  @UseGuards(JwtAuthGuard)
  sync(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<Job<AccountJobPayloadInterface>> {
    return this.accountsService.sync(id, user);
  }

  @Get('jobs/:id')
  @UseGuards(JwtAuthGuard)
  getJobById(@Param('id') id: string): Promise<Job<AccountJobPayloadInterface>> {
    return this.accountsService.getJobById(id);
  }
}
