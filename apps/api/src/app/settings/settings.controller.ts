import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsEntity } from './entities/settings.entity';
import { SettingsService } from './settings.service';

@Controller(ApiPathEnum.Settings)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  find(@CurrentUser() user: UserInterface): Promise<SettingsEntity> {
    return this.settingsService.find(user);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateSettingDto: UpdateSettingDto, @CurrentUser() user: UserInterface): Promise<SettingsEntity> {
    return this.settingsService.update(updateSettingDto, user);
  }
}
