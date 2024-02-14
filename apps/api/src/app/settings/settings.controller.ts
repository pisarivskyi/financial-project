import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { CurrentUser } from '../core/decorators/current-user.decorator';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsEntity } from './entities/settings.entity';
import { SettingsService } from './settings.service';

@Controller(ApiPathEnum.Settings)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(AuthGuard)
  find(@AuthenticatedUser() user: UserTokenParsedInterface): Promise<SettingsEntity> {
    return this.settingsService.find(user);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(
    @Body() updateSettingDto: UpdateSettingDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<SettingsEntity> {
    return this.settingsService.update(updateSettingDto, user);
  }
}
