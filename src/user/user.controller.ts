import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserProfileDto } from './dto/user-profile.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserProfileDto })
  async getMe(): Promise<UserProfileDto> {
    // const userData = await this.userService.getProfile(user);
    // if (userData.email === null && userData.name === null) {
    //   throw new UnauthorizedException('Please enter your details.');
    // }

    return {
      id: 1,
      name: 'ss',
      email: 'asdsad',
    };
  }
}
