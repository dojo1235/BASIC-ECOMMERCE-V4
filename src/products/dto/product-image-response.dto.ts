import { ApiProperty } from '@nestjs/swagger'
import { ProductImage } from '../entities/product-image.entity'

export class ProductImageResponseDto {
  @ApiProperty({ description: 'Product image', type: () => ProductImage, nullable: true })
  productImage: ProductImage | null
}
