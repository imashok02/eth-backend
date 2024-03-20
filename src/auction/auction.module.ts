import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
