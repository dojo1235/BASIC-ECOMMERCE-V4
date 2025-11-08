import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class QuantityDto {
  @IsInt({ message: 'Quantity must be an integer value' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @ApiProperty({
    description: 'The quantity of the product to add or update',
  })
  quantity: number
}
