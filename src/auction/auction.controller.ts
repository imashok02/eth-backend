import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuctionService } from './auction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Auction')
@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe() {
    // const auctionData = await this.auctionService.getProfile(Auction);
    // if (AuctionData.email === null && AuctionData.name === null) {
    //   throw new UnauthorizedException('Please enter your details.');
    // }

    return {
      id: 1,
      name: 'ss',
      email: 'asdsad',
    };
  }

  @Get('beneficiary')
  async auction() {
    return this.auctionService.getBeneficiary();
  }

  @Get('interface')
  async getAuctionInterface() {
    return this.auctionService.getAuctionInterface();
  }

  @Get('highest-bid')
  async getHighestBid() {
    return this.auctionService.getHighestBid();
  }

  @Get('highest-bidder')
  async getHighestBidder() {
    return this.auctionService.getHighestBidder();
  }

  @Get('end-time')
  async getAuctionEndTime() {
    return this.auctionService.getAuctionEndTime();
  }

  @Get('status')
  async auctionStatus() {
    return this.auctionService.auctionStatus();
  }

  @Get('stats')
  async auctionStats() {
    return this.auctionService.auctionStats();
  }

  @Get('history')
  async auctionHistory() {
    // TODO: store bids on the db, to show logs since contract does not have a map
    return this.auctionService.auctionHistory();
  }
}
