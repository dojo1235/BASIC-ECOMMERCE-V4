import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ProductStatus } from '../entities/product.entity'

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID' })
  id!: number

  @ApiProperty({ description: 'Product name' })
  name!: string

  @ApiProperty({ description: 'Product description' })
  description!: string

  @ApiProperty({ description: 'Price of the product' })
  price!: string

  @ApiProperty({ description: 'Product image URL' })
  image!: string

  @ApiProperty({ description: 'Stock quantity' })
  stock!: number

  @ApiPropertyOptional({ description: 'Product status', enum: ProductStatus })
  status?: ProductStatus

  @ApiPropertyOptional({ description: 'Indicates whether the product has been soft-deleted' })
  isDeleted?: boolean

  @ApiPropertyOptional({ description: 'User ID of the creator' })
  createdBy?: number

  @ApiPropertyOptional({ description: 'Timestamp when the record was created' })
  createdAt?: Date

  @ApiPropertyOptional({ description: 'User ID of the last updater' })
  updatedBy?: number

  @ApiPropertyOptional({ description: 'Timestamp when the record was last updated' })
  updatedAt?: Date

  @ApiPropertyOptional({ description: 'User ID of the deleter' })
  deletedBy?: number

  @ApiPropertyOptional({ description: 'Timestamp when the record was deleted' })
  deletedAt?: Date

  @ApiPropertyOptional({ description: 'User ID of the restorer' })
  restoredBy?: number

  @ApiPropertyOptional({ description: 'Timestamp when the record was restored' })
  restoredAt?: Date
}
