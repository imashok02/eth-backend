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
import { User } from 'src/user/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Bid } from './models/bid.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Bid) private readonly bidModel: typeof Bid,
  ) {
    try {
      this.contract.on(
        'HighestBidIncreased',
        (bidder: string, bidAmount: string) => {
          this.makeBidEntry(bidder, bidAmount);
          log('new bid ', bidder, ethers.formatEther(bidAmount));
        },
      );
    } catch (e) {
      log(
        'Setting up listener failed, There might not be event with the specified name',
        e,
      );
    }
  }

  private async makeBidEntry(bidder: string, bidAmount: string): Promise<void> {
    try {
      await this.bidModel.create({
        contract_address: process.env.AUCTION_CONTRACT_ADDRESS,
        address: bidder,
        bidAmount: bidAmount,
      });
    } catch (e) {
      console.log('Storing bid entry failed', e);
    }
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

  public async auctionStats(): Promise<AuctionStatsDto> {
    return {
      totalBids: '',
      totalEthVolume: '',
    };
  }

  public async auctionStatus(): Promise<AuctionStatusDto> {
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
      status:
        Date.now() > auctionEndTime
          ? AuctionStatus.ACTIVE
          : AuctionStatus.ENDED,
    };
  }

  public async auctionHistory(
    paginationSetting: PaginationDto,
  ): Promise<{ history: Bid[] }> {
    const { limit, offset } = paginationSetting;

    const history = await this.bidModel.findAll({
      limit,
      offset: offset || 0,
    });

    return {
      history,
    };
  }

  public async bid(user: User, bidInfo: BidDto): Promise<BidResponseDto> {
    const userWallet = await this.userModel.findOne({
      where: {
        id: user?.id,
      },
      attributes: ['privateKey'],
    });

    if (!userWallet.privateKey) {
      throw new InternalServerErrorException(
        toErrorMessage(
          ImErrorCodes.INTERNAL_SERVER_ERROR,
          'No private key provided to sign the transaction. Please update using PATCH /user/me',
        ),
      );
    }

    const walletPrivateKey = userWallet?.privateKey;

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

  async getBalance() {
    return this.provider.getBalance(process.env.AUCTION_CONTRACT_ADDRESS);
  }

  async getMyBalance(
    user: User,
    address: string,
  ): Promise<{ balance: string }> {
    if (address != '') {
      const userWallet = await this.userModel.findOne({
        where: {
          id: user?.id,
        },
        attributes: ['address'],
      });

      if (!userWallet.address) {
        throw new BadRequestException(
          toErrorMessage(
            ImErrorCodes.BAD_REQUEST,
            'Cannot find wallet address, Please add it',
          ),
        );
      }
      address = userWallet.address;
    }

    if (!address) {
      throw new BadRequestException(
        toErrorMessage(ImErrorCodes.BAD_REQUEST, 'No Wallet address provided'),
      );
    }

    const isValidAddress = ethers.isAddress(address);
    if (!isValidAddress) {
      throw new BadRequestException(
        toErrorMessage(ImErrorCodes.BAD_REQUEST, 'Invalid address provided'),
      );
    }

    const balance = await this.provider.getBalance(address);

    return {
      balance: ethers.formatEther(balance),
    };
  }
}
