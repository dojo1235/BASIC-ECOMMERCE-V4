import { IsOptional, IsString, IsInt, IsBoolean, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { QueryBoolean } from 'src/common/decorators/query-boolean.decorator'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export class FindBrandAuthorizationsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by brand name' })
  brandName?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Filter by seller ID' })
  sellerId?: number

  @IsOptional()
  @QueryBoolean()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Filter by authorization status' })
  isAuthorized?: boolean

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Page size for pagination' })
  limit?: number

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder })
  orderBy?: SortOrder
}
