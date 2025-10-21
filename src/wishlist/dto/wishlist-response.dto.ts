import { ApiProperty } from '@nestjs/swagger'
import { WishlistItemResponseDto } from './wishlist-item-response.dto'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class WishlistResponseDto {
  @ApiProperty({ description: 'List of wishlist items', type: () => [WishlistItemResponseDto] })
  wishlist: WishlistItemResponseDto[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
