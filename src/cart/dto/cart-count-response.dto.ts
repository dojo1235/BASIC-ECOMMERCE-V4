import { ApiProperty } from '@nestjs/swagger'

export class CartCountResponseDto {
  @ApiProperty({ description: 'Total quantity of items in cart' })
  count: number
}
