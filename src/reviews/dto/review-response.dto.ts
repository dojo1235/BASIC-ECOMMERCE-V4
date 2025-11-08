import { ApiProperty } from '@nestjs/swagger'
import { Review } from '../entities/review.entity'

export class ReviewResponseDto {
  @ApiProperty({ description: 'Review details', type: () => Review, nullable: true })
  review: Review | null
}
