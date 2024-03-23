import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UpdateUserDto, UserProfileDto } from './dto/user-profile.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from './models/user.model';

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

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserProfileDto })
  async updateUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(user, updateUserDto);
  }
}
