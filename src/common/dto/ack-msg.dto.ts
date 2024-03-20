import { ApiProperty } from "@nestjs/swagger";

export class AckMsgDto {
  @ApiProperty()
  msg: string;
}
