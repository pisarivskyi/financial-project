import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Job, JobNode } from 'bullmq';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { CreateJobDto } from './dtos/create-job.dto';
import { JobPayloadInterface } from './interfaces/job-payload.interface';
import { JobsService } from './services/jobs.service';

@Controller(ApiPathEnum.Jobs)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createJobDto: CreateJobDto, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<JobNode> {
    return this.jobsService.create(createJobDto, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<JobNode> {
    return this.jobsService.findOne(id, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@AuthenticatedUser() user: UserTokenParsedInterface): Promise<Job<JobPayloadInterface>[]> {
    return this.jobsService.findAll(user);
  }
}
