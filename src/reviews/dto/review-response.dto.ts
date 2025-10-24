import { ApiProperty } from '@nestjs/swagger'
import { Review } from '../entities/review.entity'

export class ReviewWrapperDto {
  @ApiProperty({ description: 'Review details', type: () => Review })
  review: Review
}

export class ReviewResponseDto {
  @ApiProperty({ description: 'Review response data', type: () => ReviewWrapperDto })
  data: ReviewWrapperDto

  @ApiProperty({ description: 'Review response message' })
  message: string
}
