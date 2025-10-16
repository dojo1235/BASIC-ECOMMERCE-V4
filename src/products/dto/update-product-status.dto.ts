import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ProductStatus } from '../entities/product.entity'

export class UpdateProductStatusDto {
  @IsEnum(ProductStatus)
  @IsNotEmpty()
  @ApiProperty({ description: 'New status of the product', enum: ProductStatus })
  status: ProductStatus
}