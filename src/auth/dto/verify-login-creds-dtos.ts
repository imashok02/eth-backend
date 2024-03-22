import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

import { User } from 'src/user/models/user.model';
class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  signedMessage: string;

  @ApiProperty()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;
}

class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;
}

class VerifyLoginCredsResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  authToken: string;

  @ApiProperty()
  isSignUp: boolean;

  constructor(user: User) {
    this.user = user;
  }

  setAuthToken(authToken: string): VerifyLoginCredsResponseDto {
    this.authToken = authToken;

    return this;
  }
}

export { LoginDto, VerifyLoginCredsResponseDto, RegisterDto };
