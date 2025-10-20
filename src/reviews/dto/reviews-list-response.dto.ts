import { ApiProperty } from '@nestjs/swagger'
import { ReviewResponseDto } from './review-response.dto'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class ReviewsListResponseDto {
  @ApiProperty({ description: 'List of product reviews', type: [ReviewResponseDto] })
  reviews!: ReviewResponseDto[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta!: MetaResponseDto
}
