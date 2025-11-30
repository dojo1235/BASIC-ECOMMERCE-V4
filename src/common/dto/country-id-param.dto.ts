import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CountryIdParamDto {
  @ApiProperty({ description: 'ID of the supposed country' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  countryId: number
}
