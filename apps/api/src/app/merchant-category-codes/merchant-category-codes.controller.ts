import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { CurrentUser } from '../core/decorators/current-user.decorator';
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
    @CurrentUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<MerchantCategoryCodeEntity>> {
    return this.merchantCategoryCodesService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserTokenParsedInterface): Promise<MerchantCategoryCodeEntity> {
    return this.merchantCategoryCodesService.findOne(id, user);
  }
}
