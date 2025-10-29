import { ApiProperty } from '@nestjs/swagger'
import { Order } from '../entities/order.entity'

export class OrderResponseDto {
  @ApiProperty({ description: 'Order details', type: () => Order })
  order: Order | null
}
