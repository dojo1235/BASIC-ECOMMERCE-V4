import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '../entities/order.entity'
import { ProductResponseDto } from 'src/products/dto/product-response.dto'

export class OrderItemResponseDto {
  @ApiProperty({ description: 'Order item ID' })
  id: number

  @ApiProperty({ description: 'Order ID this item belongs to' })
  orderId: number

  @ApiProperty({ description: 'Product ID of the ordered item' })
  productId: number

  @ApiProperty({ description: 'Quantity of this product in the order' })
  quantity: number

  @ApiProperty({ description: 'Price per unit of the product' })
  price: string

  @ApiProperty({ description: 'Timestamp when the order item was created' })
  createdAt: Date

  @ApiProperty({
    type: () => ProductResponseDto,
    description: 'Product details for this order item',
  })
  product: ProductResponseDto
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID' })
  id: number

  @ApiProperty({ description: 'User ID who placed the order' })
  userId: number

  @ApiProperty({ description: 'Total amount of the order' })
  total: string

  @ApiProperty({ description: 'Contact information of the customer' })
  contact: string

  @ApiProperty({ description: 'Shipping address for the order' })
  shippingAddress: string

  @ApiProperty({ description: 'Shipping fee for the order' })
  shippingFee: string

  @ApiPropertyOptional({ description: 'Order status', enum: OrderStatus })
  status?: OrderStatus

  @ApiPropertyOptional({ description: 'Indicates whether the order has been soft-deleted' })
  isDeleted?: boolean

  @ApiPropertyOptional({ description: 'Timestamp when the order was created' })
  createdAt?: Date

  @ApiPropertyOptional({ description: 'User ID of the last updater' })
  updatedById?: number

  @ApiPropertyOptional({ description: 'Timestamp when the order was last updated' })
  updatedAt?: Date

  @ApiPropertyOptional({ description: 'User ID of the deleter' })
  deletedById?: number

  @ApiPropertyOptional({ description: 'Timestamp when the order was deleted' })
  deletedAt?: Date

  @ApiPropertyOptional({ description: 'User ID of the restorer' })
  restoredById?: number

  @ApiPropertyOptional({ description: 'Timestamp when the order was restored' })
  restoredAt?: Date

  @ApiProperty({
    description: 'List of order items included in this order',
    type: () => [OrderItemResponseDto],
  })
  orderItems: OrderItemResponseDto[]
}
