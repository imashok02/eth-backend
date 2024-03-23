import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuctionService } from './auction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  AuctionBalanceDto,
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
  @UseGuards(JwtAuthGuard)
  async auction(): Promise<AuctionBeneficiary> {
    return this.auctionService.getBeneficiary();
  }

  @Get('interface')
  @UseGuards(JwtAuthGuard)
  async getAuctionInterface() {
    return this.auctionService.getAuctionInterface();
  }

  @Get('highest-bid')
  @UseGuards(JwtAuthGuard)
  async getHighestBid(): Promise<AuctionHighestBid> {
    return this.auctionService.getHighestBid();
  }

  @Get('highest-bidder')
  @UseGuards(JwtAuthGuard)
  async getHighestBidder(): Promise<AuctionHighestBidder> {
    return this.auctionService.getHighestBidder();
  }

  @Get('end-time')
  @UseGuards(JwtAuthGuard)
  async getAuctionEndTime(): Promise<AuctionEndTimeDto> {
    return this.auctionService.getAuctionEndTime();
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'To know the status of the auction',
    type: AuctionStatusDto,
  })
  async auctionStatus(): Promise<AuctionStatusDto> {
    return this.auctionService.auctionStatus();
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'To know the available balance of the contract',
    type: AuctionBalanceDto,
  })
  async auctionBalance(): Promise<AuctionBalanceDto> {
    return this.auctionService.auctionBalance();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'To know the stats of the auction',
    type: AuctionStatsDto,
  })
  async auctionStats(): Promise<AuctionStatsDto> {
    return this.auctionService.auctionStats();
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async auctionHistory(@Query() paginationDto: PaginationDto) {
    return this.auctionService.auctionHistory(paginationDto);
  }

  @Post('bid')
  @UseGuards(JwtAuthGuard)
  async bid(@CurrentUser() user: User, @Body() bidDto: BidDto) {
    return this.auctionService.bid(user, bidDto);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
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
