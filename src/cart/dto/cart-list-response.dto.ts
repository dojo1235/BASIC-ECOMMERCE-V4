import { ApiProperty } from '@nestjs/swagger'
import { CartItemResponseDto } from './cart-item-response.dto'
export class CartListResponseDto {
  @ApiProperty({
    description: 'List of cart items belonging to the user',
    type: [CartItemResponseDto],
  })
  cart: CartItemResponseDto[]

  @ApiProperty({
    description: 'Total number of all items (sum of quantities) in the cart',
  })
  count: number

  @ApiProperty({
    description: 'Total price of all items combined in the cart',
  })
  total: string
}