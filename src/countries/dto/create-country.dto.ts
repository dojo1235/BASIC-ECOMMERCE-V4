import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCountryDto {
  @IsString()
  @Length(2, 100, { message: 'Country name must be between 2 and 100 characters' })
  @ApiProperty({ description: 'Name of the country', minLength: 2, maxLength: 100 })
  name: string

  @IsString()
  @Length(2, 10, { message: 'ISO code must be between 2 and 10 characters' })
  @ApiProperty({
    description: 'ISO code of the country, e.g., US, NG',
    minLength: 2,
    maxLength: 10,
  })
  isoCode: string
}
