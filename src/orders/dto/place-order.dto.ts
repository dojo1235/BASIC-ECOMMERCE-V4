import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class PlaceOrderDto {
  @ApiProperty({ description: 'Contact phone number or email of the user placing the order' })
  @IsString()
  @IsNotEmpty()
  contact: string

  @ApiProperty({ description: 'Full shipping address for the order' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string
}
