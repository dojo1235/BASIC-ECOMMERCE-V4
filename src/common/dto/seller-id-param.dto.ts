import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class SellerIdParamDto {
  @ApiProperty({ description: 'ID of the seller' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sellerId: number
}
