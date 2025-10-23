import { ApiProperty } from '@nestjs/swagger'
import { Order } from '../entities/order.entity'
import { OrderItem } from '../entities/order.entity'
import { Product } from 'src/products/entities/product.entity'

export class OrderItemResponseDto extends OrderItem {
  @ApiProperty({
    description: 'Product details for this order item',
    type: Product,
  })
  declare product: Product
}

export class OrderResponseDto extends Order {
  @ApiProperty({
    description: 'List of order items included in this order',
    type: () => [OrderItemResponseDto],
  })
  declare orderItems: OrderItemResponseDto[]
}
