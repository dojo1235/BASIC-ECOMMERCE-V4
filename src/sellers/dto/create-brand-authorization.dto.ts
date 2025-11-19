import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateBrandAuthorizationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Brand name to authorize the seller for' })
  brandName: string
}
