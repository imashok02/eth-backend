import { Injectable } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

import { EConfig } from '../helpers/config/values';

@Injectable()
export class DatabaseService implements SequelizeOptionsFactory {
  public createSequelizeOptions(): SequelizeModuleOptions {
    let { host, port, username, password, database } = EConfig.database as any;
    const { env } = EConfig;

    const { DATABASE_URL } = process.env;
    if (DATABASE_URL) {
      const match = DATABASE_URL.match(
        /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
      );
      if (!match) {
        throw new Error('Invalid DATABASE_URL');
      }
      [, username, password, host, port, database] = match;
    }

    return {
      dialect: 'postgres',
      dialectOptions: {
        keepAlive: true,
      },
      host,
      port: port as any,
      username,
      password,
      database,
      logging: env === 'development',
      autoLoadModels: true,
      synchronize: false,
      pool: {
        max: 10,
        min: 0,
        idle: 5000,
      },
    };
  }
}
