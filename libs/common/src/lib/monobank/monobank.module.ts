import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ApiMonobankProviderService } from './api-monobank-provider.service';

@Module({
  imports: [HttpModule],
  providers: [ApiMonobankProviderService],
  exports: [ApiMonobankProviderService],
})
export class MonobankModule {}
