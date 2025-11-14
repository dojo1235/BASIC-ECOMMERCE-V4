import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class AddressIdParamDto {
  @ApiProperty({ description: 'ID of the user address' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  addressId: number
}
