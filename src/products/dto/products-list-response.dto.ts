import { ApiProperty } from '@nestjs/swagger'
import { ProductResponseDto } from './product-response.dto'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class ProductsListResponseDto {
  @ApiProperty({ description: 'List of products', type: [ProductResponseDto] })
  products!: ProductResponseDto[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta!: MetaResponseDto
}
