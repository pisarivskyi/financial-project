import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { ApiPathEnum } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordEntity } from './entities/record.entity';
import { RecordsService } from './records.service';

@Controller(ApiPathEnum.Records)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: UserEntity): Promise<RecordEntity[]> {
    return this.recordsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.recordsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto, @CurrentUser() user: UserEntity): Promise<RecordEntity> {
    return this.recordsService.update(id, updateRecordDto, user);
  }
}
