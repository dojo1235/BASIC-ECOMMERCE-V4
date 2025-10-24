import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Product } from 'src/products/entities/product.entity'
import { Cart } from '../entities/cart.entity'

export class CartItemDataDto extends Cart {
  @ApiProperty({
    description: 'Product details for this cart item',
    type: Product,
  })
  declare product: Product
}

export class CartItemWrapperDto {
  @ApiProperty({ description: 'Cart item details', type: () => CartItemDataDto })
  cartItem: CartItemDataDto
}

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Main response payload containing the cart item response',
    type: () => CartItemWrapperDto,
  })
  data: CartItemWrapperDto

  @ApiProperty({
    description: 'Descriptive message about the cart item operation',
  })
  message: string
}
