import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DatabaseService } from './service';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: DatabaseService,
    }),
  ],
})
export class DatabaseModule {}
