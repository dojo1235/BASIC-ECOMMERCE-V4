import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class BrandIdParamDto {
  @ApiProperty({ description: 'ID of the brand' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  brandId: number
}
