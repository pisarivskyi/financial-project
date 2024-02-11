import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { MerchantCategoryCodeEntity } from './entities/merchant-category-code.entity';
import { MerchantCategoryCodesController } from './merchant-category-codes.controller';
import { MerchantCategoryCodesService } from './merchant-category-codes.service';

@Module({
  controllers: [MerchantCategoryCodesController],
  providers: [MerchantCategoryCodesService],
  imports: [TypeOrmModule.forFeature([MerchantCategoryCodeEntity]), AuthenticationModule],
  exports: [MerchantCategoryCodesService],
})
export class MerchantCategoryCodesModule {}
