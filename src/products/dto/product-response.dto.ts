import { ApiProperty } from '@nestjs/swagger'
import { Product } from '../entities/product.entity'

export class ProductResponseDto {
  @ApiProperty({ description: 'Product details', type: () => Product })
  product: Product | null
}
