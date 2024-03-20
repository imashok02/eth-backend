import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

import { JWTPayload } from './dto/jwt.payload';
import {
  LoginDto,
  RegisterDto,
  VerifyLoginCredsResponseDto,
} from './dto/verify-login-creds-dtos';

import * as bcrypt from 'bcrypt';
import { ImErrorCodes, toErrorMessage } from 'src/common/error';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateJwtToken(user: User): Promise<string> {
    const payload: JWTPayload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  decodeJWTToken(token: string): JWTPayload {
    return <JWTPayload>this.jwtService.decode(token);
  }

  async register(registerDto: RegisterDto) {
    let userExists = await this.userService.findOneByEmail(registerDto.email);

    if (userExists) {
      throw new ConflictException(
        toErrorMessage(ImErrorCodes.CONFLICT, 'Email already registered'),
      );
    }

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

  async login(loginDto: LoginDto) {
    const userExists = await this.userService.findOneByEmail(loginDto.email);

    if (!userExists) {
      throw new UnauthorizedException(
        toErrorMessage(ImErrorCodes.UNAUTHORIZED, 'User not found'),
      );
    }

    const isValidLogin = await bcrypt.compare(
      loginDto.password,
      userExists.password,
    );

    if (isValidLogin) {
      const authToken = await this.generateJwtToken(userExists);

      delete userExists.id;

      return new VerifyLoginCredsResponseDto(userExists).setAuthToken(
        authToken,
      );
    } else {
      throw new UnauthorizedException(
        toErrorMessage(ImErrorCodes.UNAUTHORIZED, 'Failed to login'),
      );
    }
  }
}
