import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { CurrentUser } from '../core/decorators/current-user.decorator';
import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordEntity } from './entities/record.entity';
import { RecordsService } from './records.service';

@Controller(ApiPathEnum.Records)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() params: PageOptionsDto, @CurrentUser() user: UserInterface): Promise<PageDto<RecordEntity>> {
    return this.recordsService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserInterface) {
    return this.recordsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @CurrentUser() user: UserInterface,
  ): Promise<RecordEntity> {
    return this.recordsService.update(id, updateRecordDto, user);
  }
}
