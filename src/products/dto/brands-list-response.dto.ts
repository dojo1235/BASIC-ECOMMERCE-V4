import { ApiProperty } from '@nestjs/swagger'
import { Brand } from '../entities/brand.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class BrandsListResponseDto {
  @ApiProperty({ description: 'List of Brands', type: [Brand] })
  brands: Brand[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
