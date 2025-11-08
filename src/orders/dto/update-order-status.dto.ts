import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from '../entities/order.entity'

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  @ApiProperty({ description: 'New status of the order', enum: OrderStatus })
  status: OrderStatus
}
