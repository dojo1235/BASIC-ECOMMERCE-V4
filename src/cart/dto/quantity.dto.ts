import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class QuantityDto {
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsInt({ message: 'Quantity must be an integer value' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @ApiProperty({
    description: 'The quantity of the product to add or update',
  })
  quantity: number
}
