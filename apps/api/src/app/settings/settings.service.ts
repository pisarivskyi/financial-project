import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist } from 'class-transformer';
import { Repository } from 'typeorm';

import { UserInterface } from '@financial-project/common';

import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsEntity } from './entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(SettingsEntity) private settingsRepository: Repository<SettingsEntity>) {}

  async find(user: UserInterface): Promise<SettingsEntity> {
    try {
      const settings = await this.settingsRepository.findOne({
        where: {
          createdBy: user.id,
        },
      });

      if (!settings) {
        const newSettings = this.settingsRepository.create({
          createdBy: user.id,
        });

        return this.settingsRepository.save(newSettings);
      }

      return settings;
    } catch {
      throw new NotFoundException();
    }
  }

  async update(updateSettingDto: UpdateSettingDto, user: UserInterface): Promise<SettingsEntity> {
    try {
      const existingSettings = await this.find(user);

      const settings = plainToClassFromExist(existingSettings, {
        ...updateSettingDto,
        createdBy: user.id,
      });

      return this.settingsRepository.save(settings);
    } catch {
      throw new NotFoundException();
    }
  }
}
