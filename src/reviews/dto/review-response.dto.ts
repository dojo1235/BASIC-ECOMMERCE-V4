import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ReviewResponseDto {
  @ApiProperty({ description: 'Review ID' })
  id!: number

  @ApiProperty({ description: 'User ID who wrote the review' })
  userId!: number

  @ApiProperty({ description: 'Product ID being reviewed' })
  productId!: number

  @ApiProperty({ description: 'Rating given by the user (1–5)' })
  rating!: number

  @ApiProperty({ description: 'User comment for the review' })
  comment!: string

  @ApiPropertyOptional({ description: 'Visibility status of the review (true if visible)' })
  isVisible?: boolean

  @ApiPropertyOptional({ description: 'Timestamp when the review was created' })
  createdAt?: Date

  @ApiPropertyOptional({ description: 'Timestamp when the review was last updated' })
  updatedAt?: Date

  @ApiPropertyOptional({ description: 'User ID who hid the review (if any)' })
  hiddenById?: number

  @ApiPropertyOptional({ description: 'Timestamp when the review was hidden (if applicable)' })
  hiddenAt?: Date

  @ApiPropertyOptional({ description: 'User ID who restored the review (if any)' })
  restoredById?: number

  @ApiPropertyOptional({ description: 'Timestamp when the review was restored (if applicable)' })
  restoredAt?: Date
}
