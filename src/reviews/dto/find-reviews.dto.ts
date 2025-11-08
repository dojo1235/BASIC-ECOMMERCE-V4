import { IsEnum, IsOptional, IsNumber, IsBoolean, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { QueryBoolean } from 'src/common/decorators/query-boolean.decorator'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export class FindReviewsDto {
  @ApiPropertyOptional({ description: 'Filter by product rating (1–5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number

  @ApiPropertyOptional({ description: 'Include hidden reviews' })
  @IsBoolean()
  @QueryBoolean()
  @IsOptional()
  isVisible?: boolean

  @ApiPropertyOptional({ description: 'Page number for pagination' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: 'Page size for pagination' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number

  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder })
  @IsEnum(SortOrder)
  @IsOptional()
  orderBy?: SortOrder
}
