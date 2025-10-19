import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class ProductIdParamDto {
  @ApiProperty({ description: 'ID of the product' })
  @IsInt()
  @Min(1)
  productId!: number
}
