import { ApiProperty } from '@nestjs/swagger'
import { Order } from '../entities/order.entity'
import { OrderItem } from '../entities/order-item.entity'
import { Product } from 'src/products/entities/product.entity'

export class OrderItemDataDto extends OrderItem {
  @ApiProperty({
    description: 'Product details for this order item',
    type: Product,
  })
  declare product: Product
}

export class OrderDataDto extends Order {
  @ApiProperty({
    description: 'List of order items included in this order',
    type: () => [OrderItemDataDto],
  })
  declare orderItems: OrderItemDataDto[]
}

export class OrderWrapperDto {
  @ApiProperty({ description: 'Order details', type: () => OrderDataDto })
  order: OrderDataDto
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Order response data', type: () => OrderWrapperDto })
  data: OrderWrapperDto

  @ApiProperty({ description: 'Order response message' })
  message: string
}
