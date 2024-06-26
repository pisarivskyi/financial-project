import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ProviderTypeEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderAccountsDto } from './dto/provider-accounts.dto';
import { SaveAccountsDto } from './dto/save-accounts.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderEntity } from './entities/provider.entity';
import { ProvidersService } from './services/providers.service';

@Controller('providers')
@ApiTags('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<ProviderEntity>> {
    return this.providersService.findAll(params, user);
  }

  @Get(':providerId')
  @UseGuards(AuthGuard)
  findOne(
    @Param('providerId') providerId: string,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<ProviderEntity> {
    return this.providersService.findOne(providerId, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<ProviderEntity> {
    return this.providersService.update(id, updateProviderDto, user);
  }

  @Delete(':providerId')
  @UseGuards(AuthGuard)
  remove(
    @Param('providerId') providerId: string,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<ProviderEntity> {
    return this.providersService.remove(providerId, user);
  }

  @Post(':providerType')
  @UseGuards(AuthGuard)
  create(
    @Body() createProviderDto: CreateProviderDto,
    @Param('providerType') providerType: ProviderTypeEnum,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<ProviderEntity> {
    return this.providersService.create(createProviderDto, providerType, user);
  }

  @Get(':providerId/get-accounts')
  @UseGuards(AuthGuard)
  getAccounts(
    @Param('providerId') providerId: string,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<ProviderAccountsDto> {
    return this.providersService.getAccounts(providerId, user);
  }

  @Post(':providerId/save-accounts')
  @UseGuards(AuthGuard)
  saveAccounts(
    @Param('providerId') providerId: string,
    @Body() saveAccountsDto: SaveAccountsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ) {
    return this.providersService.saveAccounts(providerId, saveAccountsDto, user);
  }
}
