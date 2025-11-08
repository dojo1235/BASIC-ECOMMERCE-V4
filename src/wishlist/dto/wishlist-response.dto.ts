import { ApiProperty } from '@nestjs/swagger'
import { Wishlist } from '../entities/wishlist.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class WishlistResponseDto {
  @ApiProperty({ description: 'List of wishlist items', type: () => [Wishlist] })
  wishlist: Wishlist[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
