import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import {
  AuctionBeneficiary,
  AuctionEndTimeDto,
  AuctionHighestBid,
  AuctionHighestBidder,
  AuctionStatsDto,
  AuctionStatusDto,
  BidDto,
  BidResponseDto,
} from './dto/auction-response-dto';

import * as c from './contract.json';
import { AuctionStatus } from './enum/auction-status.enum';
import { ImErrorCodes, toErrorMessage } from 'src/common/error';
import { log } from 'console';

@Injectable()
export class AuctionService {
  provider = new ethers.InfuraProvider(
    {
      name: process.env.NETWORK_NAME,
      chainId: parseInt(process.env.CHAIN_ID, 10),
    },
    process.env.INFURA_PROJECT_ID,
    process.env.INFURA_PROJECT_SECRET,
  );

  contract = new ethers.Contract(
    process.env.AUCTION_CONTRACT_ADDRESS,
    c.abi,
    this.provider,
  );

  constructor() {
    this.contract.on(
      'HighestBidIncreased',
      (bidder: string, bidAmount: string) => {
        // TODO: handle incoming bids
        log('bid came ==> ', bidder, ethers.formatEther(bidAmount));
      },
    );
  }

  public async getBeneficiary(): Promise<AuctionBeneficiary> {
    const beneficiary = await this.contract.beneficiary();

    return {
      beneficiary,
    };
  }

  public async getHighestBid(): Promise<AuctionHighestBid> {
    const highestBid = await this.contract.highestBid();

    return {
      highestBid: ethers.formatUnits(highestBid),
    };
  }

  public async getHighestBidder(): Promise<AuctionHighestBidder> {
    const highestBidder = await this.contract.highestBidder();

    return {
      highestBidder,
    };
  }

  public async getAuctionInterface() {
    return this.contract.interface;
  }

  public async getAuctionEndTime(): Promise<AuctionEndTimeDto> {
    const auctionEndTime = await this.contract.auctionEndTime();

    return {
      auctionEndTime: ethers.getNumber(auctionEndTime),
    };
  }

  public async auctionStatus(): Promise<AuctionStatusDto> {
    const endTime = await this.contract.auctionEndTime();

    return {
      status: Date.now() > endTime ? AuctionStatus.ACTIVE : AuctionStatus.ENDED,
    };
  }

  public async auctionStats(): Promise<AuctionStatsDto> {
    const auctionEndTime = await this.contract.auctionEndTime();
    const highestBidder = await this.contract.highestBidder();
    const highestBid = await this.contract.highestBid();
    const beneficiary = await this.contract.beneficiary();

    return {
      auctionEndTime: DateTime.fromSeconds(
        ethers.getNumber(auctionEndTime),
      ).toLocaleString(DateTime.DATETIME_MED),
      highestBidder:
        highestBidder === ethers.ZeroAddress ? null : highestBidder,
      highestBid: ethers.formatUnits(highestBid),
      beneficiary,
    };
  }

  public async auctionHistory() {
    // TODO: store bids on the db on every event received, to show bid history since contract does not have a map

    return {};
  }

  public async bid(bidInfo: BidDto): Promise<BidResponseDto> {
    // TODO:
    // walletPrivateKey: string, amount: number
    // Get wallet private key using account from the db and using it.

    const walletPrivateKey = '';

    const wallet = new ethers.Wallet(walletPrivateKey);
    const signer = wallet.connect(this.provider);

    const contract = new ethers.Contract(
      process.env.AUCTION_CONTRACT_ADDRESS,
      c.abi,
      signer,
    );

    const highestBid = await this.contract.highestBid();

    if (bidInfo.amount <= highestBid) {
      throw new BadRequestException(
        toErrorMessage(
          ImErrorCodes.BAD_REQUEST,
          'Bid amount is less than the current highest bid, Provide a higher value',
        ),
      );
    }

    try {
      const transactionInfo = await contract.bid.send({
        value: bidInfo.amount,
      });

      return { status: 'Bid Placed', transactionInfo };
    } catch (e) {
      throw new InternalServerErrorException(
        toErrorMessage(ImErrorCodes.BAD_REQUEST, 'Error while placing bid'),
      );
    }
  }
}
