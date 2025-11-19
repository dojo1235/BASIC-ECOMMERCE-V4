import { Controller, Post, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { AdminRole } from 'src/users/entities/user.entity'
import { CountriesService } from './countries.service'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'
import { CountryResponseDto } from './dto/country-response.dto'
import { CountryIdParamDto } from 'src/common/dto/country-id-param.dto'

@Auth(AdminRole.SuperAdmin)
@Controller('admins/super/countries')
export class SuperAdminsCountriesController {
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
    return await this.countriesService.createCountry(user.id, createCountryDto)
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
      updatedById: user.id,
    })
  }
}
