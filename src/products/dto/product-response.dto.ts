import { ApiProperty } from '@nestjs/swagger'
import { Product } from 'src/products/entities/product.entity'

export class ProductWrapperDto {
  @ApiProperty({ description: 'Product details', type: () => Product })
  product: Product
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Product response data', type: () => ProductWrapperDto })
  data: ProductWrapperDto

  @ApiProperty({ description: 'Product response message' })
  message: string
}
