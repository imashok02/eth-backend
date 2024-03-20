import { Injectable } from '@nestjs/common';

import { ethers } from 'ethers';
import { DateTime } from 'luxon';

import * as c from './contract.json';

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

  constructor() {}

  public async getBeneficiary() {
    const beneficiary = await this.contract.beneficiary();

    return {
      beneficiary,
    };
  }

  public async getHighestBid() {
    const highestBid = await this.contract.highestBid();

    return {
      highestBid: ethers.formatUnits(highestBid),
    };
  }

  public async getHighestBidder() {
    const highestBidder = await this.contract.highestBidder();

    return {
      highestBidder,
    };
  }

  public async getAuctionInterface() {
    return this.contract.interface;
  }

  public async getAuctionEndTime() {
    const auctionEndTime = await this.contract.auctionEndTime();

    return {
      auctionEndTime: ethers.getNumber(auctionEndTime),
    };
  }

  public async auctionStatus() {
    const endTime = await this.contract.auctionEndTime();

    return {
      status: Date.now() > endTime ? 'RUNNING' : 'ENDED',
    };
  }

  public async auctionStats() {
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
    // TODO: store bids on the db on every event received, to show logs since contract does not have a map

    return {};
  }
}
