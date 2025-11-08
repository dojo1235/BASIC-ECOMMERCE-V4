import { ApiProperty } from '@nestjs/swagger'
import { Product } from '../entities/product.entity'

export class ProductResponseDto {
  @ApiProperty({ description: 'Product details', type: () => Product, nullable: true })
  product: Product | null
}
