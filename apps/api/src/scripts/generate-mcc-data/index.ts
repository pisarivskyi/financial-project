import { Logger } from '@nestjs/common';
import fs from 'fs/promises';
import { QueryRunner } from 'typeorm';

import { connectionSource } from '../../app/configs/typeorm.config';
import { ALLOWED_CODES } from './codes';
import mccJsonData from './mcc_codes.json';

const logger = new Logger('MCCs generator');

async function generate() {
  await connectionSource.initialize();

  const queryRunner = await connectionSource.createQueryRunner();

  logger.log('Connected');

  const generatedData = await prepareData(queryRunner);

  await fs.writeFile(
    './apps/api/src/seeds/data/mcc-data.ts',
    generateTypescriptFileContent(JSON.stringify(generatedData, undefined, '  '))
  );

  await connectionSource.destroy();
}

generate().then(() => logger.log('Done'));

async function prepareData(queryRunner: QueryRunner): Promise<any[]> {
  try {
    const allowedMccData = mccJsonData
      .map((item) => ({
        ...item,
        mcc: parseInt(item.mcc),
      }))
      .filter((item) => ALLOWED_CODES.includes(item.mcc));

    const preparedData: any[] = [];

    for (const item of allowedMccData) {
      logger.log(`processing ${item.mcc}, ${item.irs_description}`);

      const id = await generateUuid(queryRunner);

      preparedData.push({
        id,
        code: item.mcc,
        description: item.irs_description,
        categories: [],
        edited_description: item.edited_description,
        combined_description: item.combined_description,
        usda_description: item.usda_description,
        irs_description: item.irs_description,
      });
    }

    return preparedData;
  } catch (error) {
    logger.error(error);
  }
}

function generateTypescriptFileContent(data: string): string {
  const contentTemplate = `export interface MccDataInterface {
  id: string;
  code: number;
  description: string;
  categories: string[];
  edited_description: string;
  combined_description: string;
  usda_description: string;
  irs_description: string;
}

export const INITIAL_MCC_DATA: MccDataInterface[] = ${data};
`;

  return contentTemplate;
}

async function generateUuid(queryRunner: QueryRunner): Promise<string> {
  const result = await queryRunner.query('select gen_random_uuid();');

  return result[0]['gen_random_uuid'] as string;
}
