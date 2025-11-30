import { ApiProperty } from '@nestjs/swagger'
import { Seller } from '../entities/seller.entity'

export class SellerResponseDto {
  @ApiProperty({ description: 'Seller store details', type: () => Seller, nullable: true })
  seller: Seller | null
}
