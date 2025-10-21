import { ApiProperty } from '@nestjs/swagger'
import { OrderResponseDto } from './order-response.dto'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class OrdersListResponseDto {
  @ApiProperty({ description: 'List of orders', type: [OrderResponseDto] })
  orders: OrderResponseDto[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
