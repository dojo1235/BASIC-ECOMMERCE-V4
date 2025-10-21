import { ApiProperty } from '@nestjs/swagger'
import { ProductResponseDto } from 'src/products/dto/product-response.dto'

export class WishlistItemResponseDto {
  @ApiProperty({ description: 'Wishlist item ID' })
  id: number

  @ApiProperty({ description: 'User ID who owns the wishlist item' })
  userId: number

  @ApiProperty({ description: 'Product ID added to the wishlist' })
  productId: number

  @ApiProperty({ description: 'Timestamp when the product was added to the wishlist' })
  createdAt: Date

  @ApiProperty({ description: 'Product details', type: () => ProductResponseDto })
  product: ProductResponseDto
}
