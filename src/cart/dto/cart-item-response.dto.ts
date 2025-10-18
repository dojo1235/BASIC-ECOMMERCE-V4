import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ProductResponseDto } from 'src/products/dto/product-response.dto'

export class CartItemResponseDto {
  @ApiProperty({ description: 'Unique identifier for the cart item' })
  id: number

  @ApiProperty({ description: 'ID of the user who owns this cart item' })
  userId: number

  @ApiProperty({ description: 'ID of the product added to the cart' })
  productId: number

  @ApiProperty({ description: 'Quantity of this product in the user’s cart' })
  quantity: number

  @ApiPropertyOptional({ description: 'Timestamp when the cart item was created' })
  createdAt?: Date

  @ApiPropertyOptional({ description: 'Timestamp when the cart item was last updated' })
  updatedAt?: Date

  @ApiPropertyOptional({
    description: 'Product details associated with this cart item',
    type: () => ProductResponseDto,
  })
  product?: ProductResponseDto
}
