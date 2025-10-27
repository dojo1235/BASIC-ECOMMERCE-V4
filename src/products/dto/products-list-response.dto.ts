import { ApiProperty } from '@nestjs/swagger'
import { Product } from '../entities/product.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class ProductsListResponseDto {
  @ApiProperty({ description: 'List of products', type: [Product] })
  products: Product[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
