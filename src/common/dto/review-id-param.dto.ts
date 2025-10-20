import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class ReviewIdParamDto {
  @ApiProperty({ description: 'ID of the review' })
  @IsInt()
  @Min(1)
  reviewId!: number
}
