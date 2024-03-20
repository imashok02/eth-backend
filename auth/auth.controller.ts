import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  VerifyLoginCredsResponseDto,
} from './dto/verify-login-creds-dtos';

@ApiTags('auth')
@Controller(['auth'])
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

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
}
