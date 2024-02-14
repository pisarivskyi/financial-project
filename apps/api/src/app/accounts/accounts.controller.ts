import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';

@Controller(ApiPathEnum.Accounts)
@ApiTags('accounts')
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createAccountDto: CreateAccountDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<AccountEntity> {
    return this.accountsService.create(createAccountDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<AccountEntity>> {
    return this.accountsService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<AccountEntity> {
    return this.accountsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<AccountEntity> {
    return this.accountsService.update(id, updateAccountDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<AccountEntity> {
    return this.accountsService.remove(id, user);
  }
}
