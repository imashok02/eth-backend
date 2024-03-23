import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/models/user.model';
import { Bid } from './models/bid.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Bid]), ConfigModule],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
