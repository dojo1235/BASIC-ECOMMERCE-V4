import { ApiProperty } from '@nestjs/swagger'
import { Product } from 'src/products/entities/product.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class ProductsListWrapperDto {
  @ApiProperty({ description: 'List of products', type: [Product] })
  products: Product[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}

export class ProductsListResponseDto {
  @ApiProperty({ description: 'Product list response data', type: () => ProductsListWrapperDto })
  data: ProductsListWrapperDto

  @ApiProperty({ description: 'Product list response message' })
  message: string
}
