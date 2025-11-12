import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateCountryDto } from './create-country.dto'

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @ApiPropertyOptional({ description: 'Name of the country', minLength: 2, maxLength: 100 })
  name?: string

  @ApiPropertyOptional({
    description: 'ISO code of the country, e.g., US, NG',
    minLength: 2,
    maxLength: 10,
  })
  isoCode?: string
}
