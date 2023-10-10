import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Job, JobNode } from 'bullmq';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { CreateJobDto } from './dtos/create-job.dto';
import { JobPayloadInterface } from './interfaces/job-payload.interface';
import { JobsService } from './services/jobs.service';

@Controller(ApiPathEnum.Jobs)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() user: UserInterface): Promise<JobNode> {
    return this.jobsService.create(createJobDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<JobNode> {
    return this.jobsService.findOne(id, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: UserInterface): Promise<Job<JobPayloadInterface>[]> {
    return this.jobsService.findAll(user);
  }
}
