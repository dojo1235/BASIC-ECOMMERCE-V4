import { ApiPropertyOptional } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { CreateProductDto } from './create-product.dto'

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ description: 'Product name' })
  name?: string

  @ApiPropertyOptional({ description: 'Product description' })
  description?: string

  @ApiPropertyOptional({ description: 'Product price' })
  price?: number

  @ApiPropertyOptional({ description: 'Product image URL' })
  image?: string

  @ApiPropertyOptional({ description: 'Available stock quantity' })
  stock?: number
}