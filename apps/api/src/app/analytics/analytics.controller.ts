import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { AnalyticsService } from './analytics.service';
import { GetSummaryDto } from './dto/get-summary.dto';
import { SummaryDto } from './dto/summary.dto';

@Controller(ApiPathEnum.Analytics)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('summary')
  @UseGuards(AuthGuard)
  getSummaryAnalytics(
    @Body() params: GetSummaryDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<SummaryDto> {
    return this.analyticsService.getSummaryAnalytics(params, user);
  }
}
