import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { MerchantCategoryCodeEntity } from './entities/merchant-category-code.entity';
import { MerchantCategoryCodesService } from './merchant-category-codes.service';

@Controller(ApiPathEnum.MerchantCategoryCodes)
@ApiTags('merchant-category-codes')
@ApiBearerAuth()
export class MerchantCategoryCodesController {
  constructor(private readonly merchantCategoryCodesService: MerchantCategoryCodesService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<MerchantCategoryCodeEntity>> {
    return this.merchantCategoryCodesService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Param('id') id: string,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<MerchantCategoryCodeEntity> {
    return this.merchantCategoryCodesService.findOne(id, user);
  }
}
