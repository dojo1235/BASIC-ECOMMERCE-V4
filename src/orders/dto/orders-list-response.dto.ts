import { ApiProperty } from '@nestjs/swagger'
import { OrderDataDto } from './order-response.dto'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class OrdersListDataDto {
  @ApiProperty({
    description: 'List of orders',
    type: () => [OrderDataDto],
  })
  orders: OrderDataDto[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}

export class OrdersListResponseDto {
  @ApiProperty({
    description: 'Order list response data',
    type: () => OrdersListDataDto,
  })
  data: OrdersListDataDto

  @ApiProperty({ description: 'Order list response message' })
  message: string
}
