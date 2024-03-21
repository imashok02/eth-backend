import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/models/user.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
  async auctionHistory(@Query() paginationDto: PaginationDto) {
    return this.auctionService.auctionHistory(paginationDto);
  }

  @Post('bid')
  @UseGuards(JwtAuthGuard)
  async bid(@CurrentUser() user: User, @Body() bidDto: BidDto) {
    return this.auctionService.bid(user, bidDto);
  }

  @Get('balance')
  async getBalance() {
    return this.auctionService.getBalance();
  }

  @Get('my-balance')
  @UseGuards(JwtAuthGuard)
  async getMyBalance(
    @CurrentUser() user: User,
    @Query('address') address: string,
  ) {
    return this.auctionService.getMyBalance(user, address);
  }
}