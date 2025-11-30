import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProductStatus } from '../entities/product.entity'
import { QueryBoolean } from 'src/common/decorators/query-boolean.decorator'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { SortBy } from 'src/common/enums/sort-by.enum'

export class FindProductsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search term for product name' })
  search?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Filter by seller ID' })
  sellerId?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by brand name' })
  brandName?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Filter by category ID' })
  categoryId?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Filter by country ID' })
  countryId?: number

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiPropertyOptional({ description: 'Filter by status', enum: ProductStatus })
  status?: ProductStatus

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Minimum price' })
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Maximum price' })
  maxPrice?: number

  @IsOptional()
  @QueryBoolean()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Include products with verified sellers' })
  isSellerVerified?: boolean

  @IsOptional()
  @QueryBoolean()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Include deleted products' })
  isDeleted?: boolean

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
  @IsEnum(SortBy)
  @ApiPropertyOptional({ description: 'Sort by field', enum: SortBy })
  sortBy?: SortBy

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder })
  orderBy?: SortOrder
}
