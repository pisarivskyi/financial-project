import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProviderTypeEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
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
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: UserInterface): Promise<ProviderEntity[]> {
    return this.providersService.findAll(user);
  }

  @Get(':providerId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('providerId') providerId: string, @CurrentUser() user: UserInterface): Promise<ProviderEntity> {
    return this.providersService.findOne(providerId, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
    @CurrentUser() user: UserInterface
  ): Promise<ProviderEntity> {
    return this.providersService.update(id, updateProviderDto, user);
  }

  @Delete(':providerId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('providerId') providerId: string, @CurrentUser() user: UserInterface): Promise<ProviderEntity> {
    return this.providersService.remove(providerId, user);
  }

  @Post(':providerType')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProviderDto: CreateProviderDto,
    @Param('providerType') providerType: ProviderTypeEnum,
    @CurrentUser() user: UserInterface
  ): Promise<ProviderEntity> {
    return this.providersService.create(createProviderDto, providerType, user);
  }

  @Get(':providerId/get-accounts')
  @UseGuards(JwtAuthGuard)
  getAccounts(
    @Param('providerId') providerId: string,
    @CurrentUser() user: UserInterface
  ): Promise<ProviderAccountsDto> {
    return this.providersService.getAccounts(providerId, user);
  }

  @Post(':providerId/save-accounts')
  @UseGuards(JwtAuthGuard)
  saveAccounts(
    @Param('providerId') providerId: string,
    @Body() saveAccountsDto: SaveAccountsDto,
    @CurrentUser() user: UserInterface
  ) {
    return this.providersService.saveAccounts(providerId, saveAccountsDto, user);
  }
}
