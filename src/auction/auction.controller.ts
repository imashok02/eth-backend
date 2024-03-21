import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuctionService } from './auction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  AuctionBeneficiary,
  AuctionEndTimeDto,
  AuctionHighestBid,
  AuctionHighestBidder,
  AuctionStatsDto,
  AuctionStatusDto,
  BidDto,
} from './dto/auction-response-dto';

@ApiTags('Auction')
@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe() {
    return {
      id: 1,
      name: 'ss',
      email: 'asdsad',
    };
  }

  @Get('beneficiary')
  async auction(): Promise<AuctionBeneficiary> {
    return this.auctionService.getBeneficiary();
  }

  @Get('interface')
  async getAuctionInterface() {
    return this.auctionService.getAuctionInterface();
  }

  @Get('highest-bid')
  async getHighestBid(): Promise<AuctionHighestBid> {
    return this.auctionService.getHighestBid();
  }

  @Get('highest-bidder')
  async getHighestBidder(): Promise<AuctionHighestBidder> {
    return this.auctionService.getHighestBidder();
  }

  @Get('end-time')
  async getAuctionEndTime(): Promise<AuctionEndTimeDto> {
    return this.auctionService.getAuctionEndTime();
  }

  @Get('status')
  @ApiOkResponse({
    description: 'To know the status of the auction',
    type: AuctionStatusDto,
  })
  async auctionStatus(): Promise<AuctionStatusDto> {
    return this.auctionService.auctionStatus();
  }

  @Get('stats')
  async auctionStats(): Promise<AuctionStatsDto> {
    return this.auctionService.auctionStats();
  }

  @Get('history')
  async auctionHistory() {
    return this.auctionService.auctionHistory();
  }

  @Post('bid')
  async bid(@Body() bidDto: BidDto) {
    return this.auctionService.bid(bidDto);
  }
}
