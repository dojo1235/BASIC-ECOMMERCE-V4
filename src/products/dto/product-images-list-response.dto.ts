import { ApiProperty } from '@nestjs/swagger'
import { ProductImage } from '../entities/product-image.entity'

export class ProductImagesListResponseDto {
  @ApiProperty({
    description: 'List of product images',
    type: [ProductImage],
  })
  productImages: ProductImage[]
}
