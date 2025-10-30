import { ApiProperty } from '@nestjs/swagger'
import { Cart } from '../entities/cart.entity'

export class CartItemResponseDto {
  @ApiProperty({ description: 'Cart item details', type: () => Cart, nullable: true })
  cartItem: Cart | null
}
