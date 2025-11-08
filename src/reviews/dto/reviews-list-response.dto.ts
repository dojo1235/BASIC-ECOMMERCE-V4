import { ApiProperty } from '@nestjs/swagger'
import { Review } from '../entities/review.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class ReviewsListResponseDto {
  @ApiProperty({ description: 'List of reviews for the product', type: [Review] })
  reviews: Review[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
