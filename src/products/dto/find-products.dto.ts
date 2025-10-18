import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProductStatus } from '../entities/product.entity'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export class FindProductsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search term for product name' })
  search?: string

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiPropertyOptional({ description: 'Filter by status', enum: ProductStatus })
  status?: ProductStatus

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: 'Minimum price' })
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: 'Maximum price' })
  maxPrice?: number

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value === 'true'))
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Include deleted products' })
  isDeleted?: boolean

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
