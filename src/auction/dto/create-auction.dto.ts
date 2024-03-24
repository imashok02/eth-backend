import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

class CreateAuctionDto {
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}

export { CreateAuctionDto };
