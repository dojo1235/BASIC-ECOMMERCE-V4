import { ApiProperty } from '@nestjs/swagger'
import { Seller } from '../entities/seller.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class SellersListResponseDto {
  @ApiProperty({ description: 'List of sellers', type: [Seller] })
  sellers: Seller[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
