import { ApiProperty } from '@nestjs/swagger';

import { User } from '../models/user.model';

class UserProfileDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

class UpdateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  privateKey: string;
}

const toUserProfileDto = (user: User): UserProfileDto => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export { UserProfileDto, toUserProfileDto, UpdateUserDto };