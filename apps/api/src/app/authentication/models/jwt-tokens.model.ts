import { ApiProperty } from '@nestjs/swagger';

export class JwtTokensModel {
  @ApiProperty()
  accessToken: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
