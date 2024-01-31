import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';
import { GetSummaryDto } from './dto/get-summary.dto';
import { SummaryDto } from './dto/summary.dto';

@Controller(ApiPathEnum.Analytics)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('summary')
  @UseGuards(JwtAuthGuard)
  getSummaryAnalytics(@Body() params: GetSummaryDto, @CurrentUser() user: UserInterface): Promise<SummaryDto> {
    return this.analyticsService.getSummaryAnalytics(params, user);
  }
}
