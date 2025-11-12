import { Controller, Post, Get, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { CountriesService } from './countries.service'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'
import { CountryResponseDto } from './dto/country-response.dto'
import { CountriesListResponseDto } from './dto/countries-list-response.dto'
import { CountryIdParamDto } from 'src/common/dto/country-id-param.dto'
import { Role } from 'src/users/entities/user.entity'

@Auth(Role.SuperAdmin)
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new country' })
  @ApiSuccessResponse({
    description: 'Country created successfully',
    type: CountryResponseDto,
    status: HttpStatus.CREATED,
  })
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CountryResponseDto> {
    return await this.countriesService.createCountry({ ...createCountryDto, createdById: user.id })
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiSuccessResponse({
    description: 'Countries fetched successfully',
    type: CountriesListResponseDto,
  })
  async getCountries(): Promise<CountriesListResponseDto> {
    return await this.countriesService.findAllCountries()
  }

  @Get(':countryId')
  @Auth()
  @ApiOperation({ summary: 'Get a specific country' })
  @ApiSuccessResponse({
    description: 'Country fetched successfully',
    type: CountryResponseDto,
  })
  async getCountryById(@Param() { countryId }: CountryIdParamDto): Promise<CountryResponseDto> {
    return await this.countriesService.findCountryById(countryId)
  }

  @Patch(':countryId')
  @ApiOperation({ summary: 'Update a country' })
  @ApiSuccessResponse({
    description: 'Country updated successfully',
    type: CountryResponseDto,
  })
  async updateCountry(
    @Param() { countryId }: CountryIdParamDto,
    @Body() updateCountryDto: UpdateCountryDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CountryResponseDto> {
    return await this.countriesService.updateCountry(countryId, {
      ...updateCountryDto,
      createdById: user.id,
    })
  }
}
