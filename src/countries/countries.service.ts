import { Injectable } from '@nestjs/common'
import { CountriesRepository } from './countries.repository'
import { Country } from './entities/country.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class CountriesService {
  constructor(private readonly countriesRepository: CountriesRepository) {}

  // Create country (super admin)
  async createCountry(data: Partial<Country>) {
    const country = await this.countriesRepository.createCountry(data)
    return { country }
  }

  // Find all countries (both)
  async findAllCountries() {
    const countries = await this.countriesRepository.findAllCountries()
    return { countries }
  }

  // Find single country (both)
  async findCountryById(countryId: number) {
    const country = await this.countriesRepository.findCountryById(countryId)
    if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    return { country }
  }

  // Update country details (both)
  async updateCountry(countryId: number, data: Partial<Country>) {
    const existing = await this.countriesRepository.findCountryById(countryId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    await this.countriesRepository.updateCountry(countryId, data)
    const updated = await this.countriesRepository.findCountryById(countryId)
    return { country: updated }
  }
}
