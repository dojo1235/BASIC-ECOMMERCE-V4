import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsString, Max, Min } from 'class-validator'

export class ReviewDto {
  @ApiProperty({ description: 'Rating given to the product (1–5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number

  @ApiProperty({ description: 'Comment about the product' })
  @IsString()
  @IsNotEmpty()
  comment: string
}
