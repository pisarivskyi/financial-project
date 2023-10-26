import { Logger } from '@nestjs/common';

import { seed as categorySeed } from './categories-seed';
import { seed as mccSeed } from './mcc-seed';

const logger = new Logger('Seed');

async function seed() {
  await categorySeed();

  await mccSeed();
}

seed().then(() => logger.log('Done'));
