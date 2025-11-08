import { ApiProperty } from '@nestjs/swagger'
import { Order } from '../entities/order.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class OrdersListResponseDto {
  @ApiProperty({
    description: 'List of orders',
    type: () => [Order],
  })
  orders: Order[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
