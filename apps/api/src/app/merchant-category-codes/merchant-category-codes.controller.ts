import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @CurrentUser() user: UserInterface
  ): Promise<PageDto<MerchantCategoryCodeEntity>> {
    return this.merchantCategoryCodesService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<MerchantCategoryCodeEntity> {
    return this.merchantCategoryCodesService.findOne(id, user);
  }
}
