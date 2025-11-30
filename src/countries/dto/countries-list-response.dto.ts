import { ApiProperty } from '@nestjs/swagger'
import { Country } from '../entities/country.entity'

export class CountriesListResponseDto {
  @ApiProperty({
    description: 'List of countries',
    type: [Country],
  })
  countries: Country[]
}
