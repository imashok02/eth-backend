import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

import { JWTPayload } from './dto/jwt.payload';
import {
  LoginDto,
  RegisterDto,
  VerifyLoginCredsResponseDto,
} from './dto/verify-login-creds-dtos';

import * as crypto from 'crypto';
import { ImErrorCodes, toErrorMessage } from 'src/common/error';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateJwtToken(user: User): Promise<string> {
    const payload: JWTPayload = {
      sub: user.address,
    };

    return this.jwtService.sign(payload);
  }

  decodeJWTToken(token: string): JWTPayload {
    return <JWTPayload>this.jwtService.decode(token);
  }

  async register(registerDto: RegisterDto) {
    let userExists = await this.userService.findUserByAddress(
      registerDto.address,
    );

    const userInfo = await this.userService.createMinimalUser(
      userExists,
      registerDto,
    );
    userExists = userInfo?.user;

    const authToken = await this.generateJwtToken(userExists);

    // removing userId from response
    delete userExists.id;

    return new VerifyLoginCredsResponseDto(userExists).setAuthToken(authToken);
  }

  async walletLoginNonce() {
    return {
      nonce: crypto.randomBytes(32).toString('hex'),
    };
  }

  async getNonce(
    address: string,
  ): Promise<{ tempToken: string; message: string }> {
    const nonce = crypto.randomBytes(64).toString('hex');
    const tempToken = this.jwtService.sign(
      { nonce, address },
      { expiresIn: '60s' },
    );

    const message = this.getSignMessage(address, nonce);

    return {
      tempToken,
      message,
    };
  }

  private getSignMessage(address: string, nonce: string) {
    return `Please sign this message for address ${address}:\n\n${nonce}`;
  }

  async login(loginDto: LoginDto) {
    const { signedMessage, message, address } = loginDto;

    const incomingAddress = ethers.verifyMessage(message, signedMessage);

    if (incomingAddress !== address) {
      throw new UnauthorizedException(
        toErrorMessage(ImErrorCodes.UNAUTHORIZED, 'Failed to login via wallet'),
      );
    }

    return this.register({
      address,
    });
  }
}
