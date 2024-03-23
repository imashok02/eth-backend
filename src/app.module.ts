import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuctionModule } from './auction/auction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().required().default(4000),
        INFURA_PROJECT_ID: Joi.string().required().default(''),
        INFURA_PROJECT_SECRET: Joi.string().required().default(''),
        NETWORK_NAME: Joi.string().required().default('sepolia'),
        CHAIN_ID: Joi.string().required().default(11155111),
        AUCTION_CONTRACT_ADDRESS: Joi.string()
          .required()
          .default('0x23436F18efEEcf9AB7210626940963F3d2549053'),
      }),
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    AuctionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
