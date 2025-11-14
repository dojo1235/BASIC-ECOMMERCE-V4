import { ApiProperty } from '@nestjs/swagger'
import { Country } from '../entities/country.entity'

export class CountryResponseDto {
  @ApiProperty({
    description: 'country details',
    type: () => Country,
    nullable: true,
  })
  country: Country | null
}
