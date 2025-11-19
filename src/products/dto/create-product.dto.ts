import { IsNotEmpty, IsOptional, IsString, IsEnum, IsInt, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ProductStatus } from '../entities/product.entity'

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the product' })
  name: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Product description' })
  description?: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Current selling price of the product' })
  price: number

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Original price before discount' })
  originalPrice: number

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({ description: 'Available stock quantity' })
  stock: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Brand name associated with the product' })
  brandName: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Category ID the product belongs to' })
  categoryId: number

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Country ID where the product is available' })
  countryId: number

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiPropertyOptional({
    description: 'Current availability status of the product',
    enum: ProductStatus,
    default: ProductStatus.InStock,
  })
  status?: ProductStatus
}
