import { ApiProperty } from '@nestjs/swagger'

export class WishlistCountResponseDto {
  @ApiProperty({ description: 'Total number of items in wishlist' })
  count: number
}
