import { ApiProperty } from '@nestjs/swagger';
import { AuctionStatus } from '../enum/auction-status.enum';
import { IsNotEmpty, IsNumber } from 'class-validator';

class AuctionStatusDto {
  @ApiProperty()
  contractAddress: string;

  @ApiProperty()
  beneficiary: string;

  @ApiProperty()
  highestBid: string;

  @ApiProperty()
  highestBidder: string;

  @ApiProperty()
  auctionEndTime: string;

  @ApiProperty()
  status: AuctionStatus;
}

class AuctionStatsDto {
  @ApiProperty()
  totalBids: string;

  @ApiProperty()
  totalEthVolume: string;
}

class AuctionBalanceDto {
  @ApiProperty()
  availableBalance: string;
}

class AuctionEndTimeDto {
  @ApiProperty()
  auctionEndTime: number;
}

class AuctionHighestBidder {
  @ApiProperty()
  highestBidder: string;
}

class AuctionHighestBid {
  @ApiProperty()
  highestBid: string;
}

class AuctionBeneficiary {
  @ApiProperty()
  beneficiary: string;
}

class BidDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  wallet: string;
}

class BidResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  transactionInfo: any;
}

export {
  AuctionStatsDto,
  AuctionStatusDto,
  AuctionEndTimeDto,
  AuctionHighestBidder,
  AuctionHighestBid,
  AuctionBeneficiary,
  BidDto,
  BidResponseDto,
  AuctionBalanceDto,
};
