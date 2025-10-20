import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class OrderIdParamDto {
  @ApiProperty({ description: 'ID of the order' })
  @IsInt()
  @Min(1)
  orderId!: number
}
