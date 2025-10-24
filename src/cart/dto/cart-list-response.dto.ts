import { ApiProperty } from '@nestjs/swagger'
import { CartItemDataDto } from './cart-item-response.dto'

export class CartListDataDto {
  @ApiProperty({
    description: 'List of cart items belonging to the user',
    type: [CartItemDataDto],
  })
  cart: CartItemDataDto[]

  @ApiProperty({
    description: 'Total number of all items (sum of quantities) in the cart',
  })
  count: number

  @ApiProperty({
    description: 'Total price of all items combined in the cart',
  })
  total: string
}

export class CartListResponseDto {
  @ApiProperty({
    description: 'Cart list response data',
    type: () => CartListDataDto,
  })
  data: CartListDataDto

  @ApiProperty({ description: 'Cart list response message' })
  message: string
}
