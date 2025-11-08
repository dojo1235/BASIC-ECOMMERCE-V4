import { ApiProperty } from '@nestjs/swagger'

export class CartTotalResponseDto {
  @ApiProperty({ description: 'Total price of all items in cart' })
  total: number
}
