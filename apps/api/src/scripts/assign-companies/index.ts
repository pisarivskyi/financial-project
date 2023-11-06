import { Logger } from '@nestjs/common';
import { IsNull } from 'typeorm';

import { connectionSource } from '../../app/configs/typeorm.config';
import { CompanyAssignerService } from '../../app/jobs/services/company-assigner.service';
import { RecordEntity } from '../../app/records/entities/record.entity';

const logger = new Logger('Assign companies');

async function assign() {
  await connectionSource.initialize();
  const companyAssignerService = new CompanyAssignerService();

  const queryRunner = await connectionSource.createQueryRunner();

  logger.log('Connected');

  const recordsRepository = queryRunner.connection.getRepository(RecordEntity);

  let records = await recordsRepository.find({
    where: {
      company: IsNull(),
    },
  });

  records = companyAssignerService.assignCompanies(records);

  await recordsRepository.save(records);

  await connectionSource.destroy();
}

assign().then(() => logger.log('Done'));
