import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesModule } from '../categories/categories.module';
import { RecordEntity } from './entities/record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  controllers: [RecordsController],
  providers: [RecordsService],
  imports: [TypeOrmModule.forFeature([RecordEntity]), CategoriesModule],
})
export class RecordsModule {}
