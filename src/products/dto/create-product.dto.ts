import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ProductStatus } from '../entities/product.entity'

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the product' })
  name: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Product description' })
  description?: string

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Current selling price of the product' })
  price: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Original price before discount' })
  originalPrice?: number

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Available stock quantity' })
  stock: number

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Brand name associated with the product' })
  brandName?: string

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Category ID the product belongs to' })
  categoryId: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Country ID where the product is available' })
  countryId?: number

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiProperty({
    description: 'Current availability status of the product',
    enum: ProductStatus,
    default: ProductStatus.InStock,
  })
  status?: ProductStatus
}
