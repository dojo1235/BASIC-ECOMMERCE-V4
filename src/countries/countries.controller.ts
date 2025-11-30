import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CountriesService } from './countries.service'
import { CountriesListResponseDto } from './dto/countries-list-response.dto'
import { CountryResponseDto } from './dto/country-response.dto'
import { CountryIdParamDto } from 'src/common/dto/country-id-param.dto'

@Auth()
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiSuccessResponse({
    description: 'Countries fetched successfully',
    type: CountriesListResponseDto,
  })
  async getCountries(): Promise<CountriesListResponseDto> {
    return await this.countriesService.findAllCountries()
  }

  @Get(':countryId')
  @ApiOperation({ summary: 'Get a specific country' })
  @ApiSuccessResponse({
    description: 'Country fetched successfully',
    type: CountryResponseDto,
  })
  async getCountryById(@Param() { countryId }: CountryIdParamDto): Promise<CountryResponseDto> {
    return await this.countriesService.findCountryById(countryId)
  }
}
