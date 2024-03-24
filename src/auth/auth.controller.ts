import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  VerifyLoginCredsResponseDto,
} from './dto/verify-login-creds-dtos';

@ApiTags('auth')
@Controller(['v1/auth'])
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<VerifyLoginCredsResponseDto> {
    try {
      return this.authService.login(loginDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<VerifyLoginCredsResponseDto> {
    try {
      return this.authService.register(registerDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get('wallet-login-nonce')
  async walletLoginNonce(): Promise<{ nonce: string }> {
    try {
      return this.authService.walletLoginNonce();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get('get-nonce')
  async getNonce(
    @Query('address') address: string,
  ): Promise<{ tempToken: string; message: string }> {
    try {
      return this.authService.getNonce(address);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get('verify')
  async verifyLogin(
    @Query('address') address: string,
  ): Promise<{ tempToken: string; message: string }> {
    try {
      return this.authService.getNonce(address);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
