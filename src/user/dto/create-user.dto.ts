import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

class CreateUserDto {
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}

export { CreateUserDto };
