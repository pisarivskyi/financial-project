import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [__dirname + '/../**/*.entity.ts', __dirname + '/../**/*.entity.js'],
  migrations: [path.normalize(__dirname + '/../../migrations/*{.ts,.js}')],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
