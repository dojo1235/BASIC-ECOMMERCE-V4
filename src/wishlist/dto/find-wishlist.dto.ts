import { IsEnum, IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export class FindWishlistDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: 'Page size for pagination' })
  limit?: number

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder })
  orderBy?: SortOrder
}
